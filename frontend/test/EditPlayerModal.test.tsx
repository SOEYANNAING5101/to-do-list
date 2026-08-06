import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import EditPlayerModal from '../src/modal/EditPlayerModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event'
import { useEditPlayer } from '../src/hooks/usePlayers';

vi.mock('../src/hooks/usePlayers', () => {
    return {
        useEditPlayer: vi.fn()
    }
})


describe('EditPlayerModal UI TEST', () => {
    let testQueryClient = new QueryClient();

    const mockMutate = vi.fn();

    const fakePlayer = {
        player_id: '99',
        name: "Messi",
        goals: 800,
        assists: 700,
        created_at: '2026-01-01'
    }
    beforeEach(() => {
        testQueryClient = new QueryClient();
        vi.clearAllMocks();

        (useEditPlayer as any).mockReturnValue({
            mutate: mockMutate,
            isPending: false
        })
    })
    afterEach(() => {
        cleanup();
    })
    // Test1: Initial Render
    it('shows the original name, goals and assists when modal is opened', () => {
        render(
            <QueryClientProvider client={testQueryClient}>
                <EditPlayerModal
                    isOpen={true}
                    onClose={() => { }}
                    player={fakePlayer}
                />
            </QueryClientProvider>

        );
        expect(screen.getByText('Messi')).toBeInTheDocument();
        expect(screen.getByDisplayValue('800')).toBeInTheDocument();
        expect(screen.getByDisplayValue('700')).toBeInTheDocument();
    });
    // Test2: User Interaction
    it('allows user to change goals and assists values', async () => {
        const user = userEvent.setup();
        render(
            <QueryClientProvider client={testQueryClient}>
                <EditPlayerModal
                    isOpen={true}
                    onClose={() => { }}
                    player={fakePlayer} />
            </QueryClientProvider>
        )
        const goalInput = screen.getByDisplayValue('800');
        const assistInput = screen.getByDisplayValue('700');

        await user.clear(goalInput);
        await user.type(goalInput, '900');

        await user.clear(assistInput);
        await user.type(assistInput, '600');

        expect(goalInput).toHaveValue(900);
        expect(assistInput).toHaveValue(600);
    });
    // Test3: Edit Button
    it('submits the correct data when the edit button is clicked', async () => {
        const user = userEvent.setup();
        render(
            <QueryClientProvider client={testQueryClient}>
                <EditPlayerModal
                    isOpen={true}
                    onClose={() => { }}
                    player={fakePlayer} />
            </QueryClientProvider>
        )

        const goalInput = screen.getByDisplayValue('800')
        const assistInput = screen.getByDisplayValue('700')
        const submitButton = screen.getByRole('button', { name: /edit player/i });

        await user.clear(goalInput);
        await user.type(goalInput, '900');
        await user.click(submitButton);

        expect(mockMutate).toHaveBeenCalledWith(
            expect.objectContaining({
                player_id: '99',
                name: "Messi",
                goals: 900,
                assists: 700,
            }),
            expect.any(Object)
        )
    })
    // Test4: X button
    it ('calls the onClose function when the X button is clicked ', async() => {
        const user = userEvent.setup();
        const mockOnClose = vi.fn();
        render(
            <QueryClientProvider client={testQueryClient}>
                <EditPlayerModal
                    isOpen={true}
                    onClose={mockOnClose}
                    player={fakePlayer} />
            </QueryClientProvider>
        )
        const closeButton = screen.getByRole('button',{name: /x/i});
        await user.click(closeButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    })
})