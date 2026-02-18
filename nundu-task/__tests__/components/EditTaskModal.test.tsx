import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditTaskModal from '@/components/EditTaskModal';
import * as apiMethods from '@/lib/apiMethods';

jest.mock('@/lib/apiMethods');

describe('EditTaskModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    priority: 'High',
    assignedTo: 'dev-1',
    sprint: 'Sprint 1',
    state: 'in-progress',
    startDate: '2026-02-18',
    endDate: '2026-02-25',
  };

  const mockDevelopers = [
    { id: 'dev-1', name: 'John Doe', email: 'john@example.com' },
    { id: 'dev-2', name: 'Jane Smith', email: 'jane@example.com' },
  ];

  const mockSprints = [
    { id: '1', name: 'Sprint 1' },
    { id: '2', name: 'Sprint 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (apiMethods.apiPut as jest.Mock).mockResolvedValue({
      success: true,
      data: mockTask,
    });
    (apiMethods.apiDelete as jest.Mock).mockResolvedValue({
      success: true,
    });
  });

  it('renders edit form with task data', () => {
    render(
      <EditTaskModal
        task={mockTask}
        onClose={mockOnClose}
        developers={mockDevelopers}
        sprints={mockSprints}
      />
    );

    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
  });

  it('shows delete button', () => {
    render(
      <EditTaskModal
        task={mockTask}
        onClose={mockOnClose}
        developers={mockDevelopers}
        sprints={mockSprints}
      />
    );

    const deleteButton = screen.getByTitle('Delete task');
    expect(deleteButton).toBeInTheDocument();
  });

  it('updates task when form is submitted', async () => {
    const user = userEvent.setup();
    render(
      <EditTaskModal
        task={mockTask}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        developers={mockDevelopers}
        sprints={mockSprints}
      />
    );

    const titleInput = screen.getByDisplayValue('Test Task') as HTMLInputElement;
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Task');

    const submitButton = screen.getByText('Update Task');
    await user.click(submitButton);

    await waitFor(() => {
      expect(apiMethods.apiPut).toHaveBeenCalledWith(`/tasks/${mockTask.id}`, expect.any(Object));
    });
  });

  it('deletes task when delete button is clicked', async () => {
    const user = userEvent.setup();

    // Mock window.confirm to return true
    window.confirm = jest.fn(() => true);

    render(
      <EditTaskModal
        task={mockTask}
        onClose={mockOnClose}
        developers={mockDevelopers}
        sprints={mockSprints}
      />
    );

    const deleteButton = screen.getByTitle('Delete task');
    await user.click(deleteButton);

    await waitFor(() => {
      expect(apiMethods.apiDelete).toHaveBeenCalledWith(`/tasks/${mockTask.id}`);
    });
  });

  it('does not delete when user cancels confirmation', async () => {
    const user = userEvent.setup();

    window.confirm = jest.fn(() => false);

    render(
      <EditTaskModal
        task={mockTask}
        onClose={mockOnClose}
        developers={mockDevelopers}
        sprints={mockSprints}
      />
    );

    const deleteButton = screen.getByTitle('Delete task');
    await user.click(deleteButton);

    expect(apiMethods.apiDelete).not.toHaveBeenCalled();
  });

  it('calls onClose when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <EditTaskModal
        task={mockTask}
        onClose={mockOnClose}
        developers={mockDevelopers}
        sprints={mockSprints}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays developer names in select', () => {
    render(
      <EditTaskModal
        task={mockTask}
        onClose={mockOnClose}
        developers={mockDevelopers}
        sprints={mockSprints}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('displays sprint names in select', () => {
    render(
      <EditTaskModal
        task={mockTask}
        onClose={mockOnClose}
        developers={mockDevelopers}
        sprints={mockSprints}
      />
    );

    expect(screen.getByText('Sprint 1')).toBeInTheDocument();
    expect(screen.getByText('Sprint 2')).toBeInTheDocument();
  });
});
