import organizationService from '../services/organization.service';
import apiService from '../services/api.service';

jest.mock('../services/api.service');

const mockedApi = apiService as jest.Mocked<typeof apiService>;

describe('OrganizationService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getAll calls apiService.get and returns data', async () => {
    const fake = [{ id: '1', name: 'Org1' }];
    mockedApi.get.mockResolvedValue(fake as any);

    const res = await organizationService.getAll();
    expect(mockedApi.get).toHaveBeenCalledWith('/v1/organizations/all', undefined);
    expect(res).toEqual(fake);
  });

  it('create calls apiService.post', async () => {
    const payload = { name: 'New Org' };
    const created = { id: '2', name: 'New Org' };
    mockedApi.post.mockResolvedValue(created as any);

    const res = await organizationService.create(payload as any);
    expect(mockedApi.post).toHaveBeenCalledWith('/v1/organizations', payload);
    expect(res).toEqual(created);
  });
});
