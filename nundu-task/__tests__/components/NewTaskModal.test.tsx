import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewTaskModal from '@/components/NewTaskModal';
import * as apiMethods from '@/lib/apiMethods';

jest.mock('@/lib/apiMethods');

describe('NewTaskModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  const mockDevelopers = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ];

  const mockSprints = [
    { id: '1', name: 'Sprint 1' },
    { id: '2', name: 'Sprint 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (apiMethods.apiGet as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
    });
    (apiMethods.apiPost as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: '1', title: 'Test Task' },
    });
  });

  it('renders task form with all fields', async () => {
    (apiMethods.apiGet as jest.Mock)
      .mockResolvedValueOnce({ success: true, data: mockDevelopers })
      .mockResolvedValueOnce({ success: true, data: mockSprints });

    render(<NewTaskModal onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
    expect(screen.getByLabelText('Assigned To')).toBeInTheDocument();
    expect(screen.getByLabelText('Sprint')).toBeInTheDocument();
    expect(screen.getByLabelText('State')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    expect(screen.getByLabelText('End Date')).toBeInTheDocument();
  });

  it('loads developers and sprints on mount', async () => {
    (apiMethods.apiGet as jest.Mock)
      .mockResolvedValueOnce({ success: true, data: mockDevelopers })
      .mockResolvedValueOnce({ success: true, data: mockSprints });

    render(<NewTaskModal onClose={mockOnClose} />);

    await waitFor(() => {
      expect(apiMethods.apiGet).toHaveBeenCalledWith('/developers');
      expect(apiMethods.apiGet).toHaveBeenCalledWith('/sprints');
    });
  });

  it('shows developers in select options', async () => {
    (apiMethods.apiGet as jest.Mock)
      .mockResolvedValueOnce({ success: true, data: mockDevelopers })
      .mockResolvedValueOnce({ success: true, data: mockSprints });

    render(<NewTaskModal onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('submits task with valid data', async () => {
    // Mock window.location.reload
    Object.defineProperty(window.location, 'reload', {
      configurable: true,
      value: jest.fn(),
    });

    (apiMethods.apiGet as jest.Mock)
      .mockResolvedValueOnce({ success: true, data: mockDevelopers })
      .mockResolvedValueOnce({ success: true, data: mockSprints });

    const user = userEvent.setup();
    render(<NewTaskModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
    await user.type(titleInput, 'New Test Task');

    const submitButton = screen.getByText('Create Task');
    await user.click(submitButton);

    await waitFor(() => {
      expect(apiMethods.apiPost).toHaveBeenCalled();
    });
  });

  it('shows error when title is empty', async () => {
    (apiMethods.apiGet as jest.Mock)
      .mockResolvedValueOnce({ success: true, data: mockDevelopers })
      .mockResolvedValueOnce({ success: true, data: mockSprints });

    const user = userEvent.setup();
    render(<NewTaskModal onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toBeInTheDocument();
    });

    const submitButton = screen.getByText('Create Task');
    await user.click(submitButton);

    // Form validation should prevent submission
    expect(apiMethods.apiPost).not.toHaveBeenCalled();
  });

  it('calls onClose when Cancel button is clicked', async () => {
    (apiMethods.apiGet as jest.Mock)
      .mockResolvedValueOnce({ success: true, data: mockDevelopers })
      .mockResolvedValueOnce({ success: true, data: mockSprints });

    const user = userEvent.setup();
    render(<NewTaskModal onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows state options', async () => {
    (apiMethods.apiGet as jest.Mock)
      .mockResolvedValueOnce({ success: true, data: mockDevelopers })
      .mockResolvedValueOnce({ success: true, data: mockSprints });

    render(<NewTaskModal onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText('To Do')).toBeInTheDocument();
    });

    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('To Validate')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });
});
