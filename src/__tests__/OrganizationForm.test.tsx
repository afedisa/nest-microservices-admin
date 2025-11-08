import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OrganizationFormPage from '../pages/OrganizationFormPage';
import organizationService from '../services/organization.service';

jest.mock('../services/organization.service');

const mockedOrgService = organizationService as jest.Mocked<typeof organizationService>;

describe('OrganizationFormPage', () => {
  beforeEach(() => {
    mockedOrgService.create.mockResolvedValue({ id: '1', name: 'Test' } as any);
  });

  it('renders and submits form', async () => {
    render(
      <BrowserRouter>
        <OrganizationFormPage />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText(/Nombre/i) as HTMLInputElement;
    const addressInput = screen.getByLabelText(/Dirección/i) as HTMLInputElement;
    const cityInput = screen.getByLabelText(/Ciudad/i) as HTMLInputElement;
    const saveBtn = screen.getByRole('button', { name: /Guardar/i });

    fireEvent.change(nameInput, { target: { value: 'My Org' } });
    fireEvent.change(addressInput, { target: { value: 'Calle 1' } });
    fireEvent.change(cityInput, { target: { value: 'Madrid' } });

    fireEvent.click(saveBtn);

    await waitFor(() => expect(mockedOrgService.create).toHaveBeenCalled());
    expect(mockedOrgService.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'My Org' }));
  });
});
