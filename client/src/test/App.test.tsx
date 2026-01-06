import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../App';

const mockFetch = (responses: Response[]) => {
  const fetchMock = vi.fn();
  responses.forEach((response) => fetchMock.mockResolvedValueOnce(response));
  vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);
  return fetchMock;
};

describe('App', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads and renders items', async () => {
    mockFetch([
      new Response(
        JSON.stringify({
          id: 'list',
          title: 'Meine Liste',
          createdAt: new Date().toISOString(),
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
      new Response(
        JSON.stringify([
          {
            id: '1',
            name: 'Milch',
            bought: false,
            quantity: 1,
            order: 0,
            createdAt: new Date().toISOString(),
          },
        ]),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    ]);

    render(<App />);

    expect(await screen.findByText('Milch')).toBeInTheDocument();
  });

  it('adds items and increases quantity', async () => {
    const createdAt = new Date().toISOString();

    mockFetch([
      new Response(
        JSON.stringify({
          id: 'list',
          title: 'Meine Liste',
          createdAt: new Date().toISOString(),
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
      new Response(
        JSON.stringify({
          id: '2',
          name: 'Butter',
          bought: false,
          quantity: 1,
          order: 0,
          createdAt,
        }),
        { status: 201, headers: { 'Content-Type': 'application/json' } },
      ),
      new Response(
        JSON.stringify({
          id: '2',
          name: 'Butter',
          bought: false,
          quantity: 2,
          order: 0,
          createdAt,
        }),
        { status: 201, headers: { 'Content-Type': 'application/json' } },
      ),
    ]);

    render(<App />);

    const input = await screen.findByPlaceholderText('z. B. Butter');
    await userEvent.type(input, 'Butter');
    await userEvent.click(screen.getByRole('button', { name: 'Hinzufügen' }));

    expect(await screen.findByText('Butter')).toBeInTheDocument();
    expect(screen.getByLabelText('Anzahl von Butter')).toHaveTextContent('1');

    await userEvent.clear(input);
    await userEvent.type(input, 'Butter');
    await userEvent.click(screen.getByRole('button', { name: 'Hinzufügen' }));

    expect(await screen.findByLabelText('Anzahl von Butter')).toHaveTextContent('2');
  });

  it('toggles bought state', async () => {
    const createdAt = new Date().toISOString();

    mockFetch([
      new Response(
        JSON.stringify({
          id: 'list',
          title: 'Meine Liste',
          createdAt: new Date().toISOString(),
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
      new Response(
        JSON.stringify([
          {
            id: '3',
            name: 'Brot',
            bought: false,
            quantity: 1,
            order: 0,
            createdAt,
          },
        ]),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
      new Response(
        JSON.stringify({
          id: '3',
          name: 'Brot',
          bought: true,
          quantity: 1,
          order: 0,
          createdAt,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    ]);

    render(<App />);

    const checkbox = await screen.findByRole('checkbox', { name: 'Brot gekauft' });
    await userEvent.click(checkbox);

    await waitFor(() => {
      expect(screen.getByText('Brot')).toHaveStyle('text-decoration: line-through');
    });
  });

  it('deletes an item', async () => {
    mockFetch([
      new Response(
        JSON.stringify({
          id: 'list',
          title: 'Meine Liste',
          createdAt: new Date().toISOString(),
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
      new Response(
        JSON.stringify([
          {
            id: '4',
            name: 'Kaese',
            bought: false,
            quantity: 1,
            order: 0,
            createdAt: new Date().toISOString(),
          },
        ]),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
      new Response(null, { status: 204 }),
    ]);

    render(<App />);

    expect(await screen.findByText('Kaese')).toBeInTheDocument();
    await userEvent.click(screen.getAllByLabelText('Kaese löschen')[0]);

    await waitFor(() => {
      expect(screen.queryByText('Kaese')).not.toBeInTheDocument();
    });
  });
});
