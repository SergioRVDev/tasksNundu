import { render, screen, fireEvent } from '@testing-library/react';
import FiltersSection from '@/components/FiltersSection';

// Mock the modal components
jest.mock('@/components/NewTaskModal', () => {
  return function MockNewTaskModal() {
    return <div data-testid="new-task-modal">New Task Modal</div>;
  };
});

jest.mock('@/components/NewDeveloperModal', () => {
  return function MockNewDeveloperModal() {
    return <div data-testid="new-developer-modal">New Developer Modal</div>;
  };
});

jest.mock('@/components/NewSprintModal', () => {
  return function MockNewSprintModal() {
    return <div data-testid="new-sprint-modal">New Sprint Modal</div>;
  };
});

describe('FiltersSection', () => {
  const mockSetView = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders view toggle buttons', () => {
    render(<FiltersSection view="table" setView={mockSetView} />);

    expect(screen.getByText('Tabla')).toBeInTheDocument();
    expect(screen.getByText('Kanban')).toBeInTheDocument();
  });

  it('calls setView when table button is clicked', () => {
    render(<FiltersSection view="kanban" setView={mockSetView} />);

    fireEvent.click(screen.getByText('Tabla'));
    expect(mockSetView).toHaveBeenCalledWith('table');
  });

  it('calls setView when kanban button is clicked', () => {
    render(<FiltersSection view="table" setView={mockSetView} />);

    fireEvent.click(screen.getByText('Kanban'));
    expect(mockSetView).toHaveBeenCalledWith('kanban');
  });

  it('renders all action buttons', () => {
    render(<FiltersSection view="table" setView={mockSetView} />);

    const buttons = screen.getAllByRole('button');
    const hasDeveloper = buttons.some(btn => btn.textContent?.includes('Developer'));
    const hasSprint = buttons.some(btn => btn.textContent?.includes('Sprint'));
    const hasTask = buttons.some(btn => btn.textContent?.includes('Task'));

    expect(hasDeveloper).toBe(true);
    expect(hasSprint).toBe(true);
    expect(hasTask).toBe(true);
  });

  it('opens NewTaskModal when Task button is clicked', () => {
    render(<FiltersSection view="table" setView={mockSetView} />);

    fireEvent.click(screen.getAllByText(/Task/)[0]);
    expect(screen.getByTestId('new-task-modal')).toBeInTheDocument();
  });

  it('opens NewDeveloperModal when Developer button is clicked', () => {
    render(<FiltersSection view="table" setView={mockSetView} />);

    const buttons = screen.getAllByRole('button');
    const devButton = buttons.find(btn => btn.textContent?.includes('Developer'));
    if (devButton) fireEvent.click(devButton);
    expect(screen.getByTestId('new-developer-modal')).toBeInTheDocument();
  });

  it('opens NewSprintModal when Sprint button is clicked', () => {
    render(<FiltersSection view="table" setView={mockSetView} />);

    const buttons = screen.getAllByRole('button');
    const sprintButton = buttons.find(btn => btn.textContent?.includes('Sprint'));
    if (sprintButton) fireEvent.click(sprintButton);
    expect(screen.getByTestId('new-sprint-modal')).toBeInTheDocument();
  });

  it('highlights active view button', () => {
    const { rerender } = render(<FiltersSection view="table" setView={mockSetView} />);

    const tableButton = screen.getByText('Tabla').closest('button');
    expect(tableButton).toHaveClass('bg-white');

    rerender(<FiltersSection view="kanban" setView={mockSetView} />);

    const kanbanButton = screen.getByText('Kanban').closest('button');
    expect(kanbanButton).toHaveClass('bg-white');
  });
});
