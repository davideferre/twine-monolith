import 'jest-dom/extend-expect';
import { cleanup, waitForElement, wait, fireEvent } from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';
import { axios } from '../../../api';
import { renderWithRouter } from '../../../tests';
import Visitor from '../Visitor';


describe('Visitor Component', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  test(':: succesful load displays visitor details on page', async () => {
    expect.assertions(3);

    mock.onPut('/community-businesses/me')
      .reply(200, { result: null });

    mock.onGet('/genders')
      .reply(200, { result: [{ id: 1, name: 'male' }, { id: 2, name: 'female' }, { id: 3, name: 'prefer not to say' }] });

    mock.onGet('/community-businesses/me/visitors/4')
      .reply(200,
        { result: {
          qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgEQVR4AewaftIAAAzUSU==',
          id: 4,
          name: 'yusra mardini',
          gender: 'female',
          birthYear: 1998,
          email: 'maemail@gmail.com',
          phoneNumber: '7835110026',
          createdAt: '2017-05-15T12:24:52.000Z',
          isEmailConsentGranted: false,
          isSMSConsentGranted: false } });

    mock.onGet('/community-businesses/me', { params: { fields: ['name', 'logoUrl'] } })
      .reply(200,
        { result: {
          id: 3,
          name: 'Frog Finders',
          sector: 'Environment or nature',
          logoUrl: null,
          createdAt: '2017-05-15T12:24:56.000Z' } });

    mock.onGet('/users/me')
      .reply(200, { email: 'findmyfroggy@frogfinders.com' });

    const { getByText } = renderWithRouter({
      match: {
        isExact: true,
        params: { id: '4' },
        path: '/admin/visitors/:id',
        url: '/admin/visitors/4',
      },
    })(Visitor);

    const [name, gender, email] = await waitForElement(() => [
      getByText('yusra mardini'),
      getByText('female'),
      getByText('maemail@gmail.com'),
    ]);

    expect(name).toHaveTextContent('yusra mardini');
    expect(gender).toHaveTextContent('female');
    expect(email).toHaveTextContent('maemail@gmail.com');
  });

  test(':: unauthorised request redirects to login', async () => {
    expect.assertions(1);

    mock.onPut('/community-businesses/me')
      .reply(200, { result: null });

    mock
      .onGet('/genders').reply(401, { result: null })
      .onGet('/community-businesses/me/visitors/4').reply(401, { result: null })
      .onGet('/community-businesses/me', { params: { fields: ['name', 'logoUrl'] } })
      .reply(401, { result: null })
      .onGet('/users/me')
      .reply(401, { result: null });

    const { history } = renderWithRouter({
      match: {
        isExact: true,
        params: { id: '4' },
        path: '/admin/visitors/:id',
        url: '/admin/visitors/4',
      },
    })(Visitor);

    await wait(() => expect(history.location.pathname).toEqual('/login'));
  });

  test(':: can update visitor details', async () => {
    expect.assertions(4);

    mock.onPut('/community-businesses/me')
      .reply(200, { result: null });

    mock
      .onGet('/genders')
      .reply(200, { result: [{ id: 1, name: 'male' }, { id: 2, name: 'female' }, { id: 3, name: 'prefer not to say' }] });

    mock
      .onGet('/community-businesses/me/visitors/4')
      .reply(200,
        { result: {
          qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgEQVR4AewaftIAAAzUSU==',
          id: 4,
          name: 'yusra mardini',
          gender: 'female',
          birthYear: 1998,
          email: 'maemail@gmail.com',
          phoneNumber: '7835110026',
          createdAt: '2017-05-15T12:24:52.000Z',
          isEmailConsentGranted: false,
          isSMSConsentGranted: false } })
      .onPut('/community-businesses/me/visitors/4')
      .reply(200, {
        result: {
          qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgEQVR4AewaftIAAAzUSU==',
          id: 4,
          name: 'foosra mardini',
          gender: 'male',
          birthYear: 1998,
          email: 'manewmail@gmail.com',
          phoneNumber: '7835110026',
          createdAt: '2017-05-15T12:24:52.000Z',
          modifiedAt: (new Date()).toISOString(),
          isEmailConsentGranted: false,
          isSMSConsentGranted: false,
        },
      });

    mock
      .onGet('/community-businesses/me', { params: { fields: ['name', 'logoUrl'] } })
      .reply(200, { result: { name: 'Frog Finders', logoUrl: null } })
      .onGet('/users/me')
      .reply(200, { email: 'findmyfroggy@frogfinders.com' });

    const tools = renderWithRouter({
      match: {
        isExact: true,
        params: { id: '4' },
        path: '/admin/visitors/:id',
        url: '/admin/visitors/4',
      },
    })(Visitor);

    // ensures page has successfully loaded before continuing with tests
    await waitForElement(() => tools.getByText('yusra mardini'));

    const [
      nameInput,
      emailInput,
      genderInput,
      emailConsentBox,
      submitBtn,
    ] = await waitForElement(() => [
      tools.getByLabelText('Name'),
      tools.getByLabelText('Email'),
      tools.getByLabelText('Gender'),
      tools.container.querySelector('#visitor-email-consent'),
      tools.getByText('SAVE'),
    ]);

    fireEvent.change(nameInput, { target: { value: 'foosra mardini' } });
    fireEvent.change(emailInput, { target: { value: 'manewmail@gmail.com' } });
    fireEvent.change(genderInput, { target: { value: 'male' } });
    fireEvent.change(emailConsentBox, { target: { value: 'on' } });
    fireEvent.click(submitBtn);

    const [nameText, emailText, genderText] = await waitForElement(() => [
      tools.getByText('foosra mardini'),
      tools.getByText('manewmail@gmail.com'),
      tools.getByText('male'),
    ]);

    expect(nameText).toBeTruthy();
    expect(emailText).toBeTruthy();
    expect(genderText).toBeTruthy();
    expect(emailConsentBox.value).toBe('on');
  });

  test(':: fail to update visitor details', async () => {
    expect.assertions(1);

    mock.onPut('/community-businesses/me')
      .reply(200, { result: null });

    mock
      .onGet('/genders')
      .reply(200, { result: [{ id: 1, name: 'male' }, { id: 2, name: 'female' }, { id: 3, name: 'prefer not to say' }] });

    mock
      .onGet('/community-businesses/me/visitors/4')
      .reply(200,
        { result: {
          qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgEQVR4AewaftIAAAzUSU==',
          id: 4,
          name: 'yusra mardini',
          gender: 'female',
          birthYear: 1998,
          email: 'maemail@gmail.com',
          phoneNumber: '7835110026',
          createdAt: '2017-05-15T12:24:52.000Z',
          isEmailConsentGranted: false,
          isSMSConsentGranted: false } })
      .onPut('/community-businesses/me/visitors/4')
      .reply(400, { error: { email: 'Invalid email' } });

    mock
      .onGet('/community-businesses/me', { params: { fields: ['name', 'logoUrl'] } })
      .reply(200, { result: { name: 'Frog Finders', logoUrl: null } })
      .onGet('/users/me')
      .reply(200, { email: 'findmyfroggy@frogfinders.com' });

    const tools = renderWithRouter({
      match: {
        isExact: true,
        params: { id: '4' },
        path: '/admin/visitors/:id',
        url: '/admin/visitors/4',
      },
    })(Visitor);

    // ensures page has successfully loaded before continuing with tests
    await waitForElement(() => tools.getByText('yusra mardini'));

    const [birthYearInput, submitBtn] = await waitForElement(() => [
      tools.getByLabelText('Email'),
      tools.getByText('SAVE'),
    ]);

    fireEvent.change(birthYearInput, { target: { value: 'qdeoifwrgheui' } });
    fireEvent.click(submitBtn);

    const [errorText] = await waitForElement(() => [
      tools.getByText('Invalid email'),
    ]);

    expect(errorText).toBeTruthy();
  });
});

