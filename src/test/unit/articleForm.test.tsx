import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArticleForm from '../../components/ArticleForm';
import { ArticleStatus } from '../../types';
import { useState } from 'react';

// Helper to render form with base props
const TestArticleForm = (overrideProps: Partial<Parameters<typeof ArticleForm>[0]> = {}) => {
  const [articleForm, setArticleForm] = useState({
    title: '',
    status: ArticleStatus.DRAFT,
    author: '',
    content: '',
    summary: '',
    ...overrideProps.articleForm,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const baseProps = {
    formErrors,
    isSubmitting: false,
    editingArticle: null,
    onSubmit: vi.fn(),
    ...overrideProps,
    articleForm,
    onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setArticleForm(prev => ({ ...prev, [name]: value }));
      if (overrideProps.onFormChange) {
        overrideProps.onFormChange(e);
      }
    },
    onValidation: (isValid: boolean, errors: Record<string, string>) => {
      if (!isValid) {
        setFormErrors(errors);
      } else {
        setFormErrors({});
      }
    }
  };

  return <ArticleForm {...baseProps} />;
};

const renderForm = (overrideProps = {}) => {
  return render(<TestArticleForm {...overrideProps} />);
}

describe('ArticleForm', () => {
  it('renders all fields with correct placeholders', () => {
    renderForm()
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/author/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/summary/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveTextContent(/create article/i)
  })

  it('pre-fills values when editing', () => {
    renderForm({
      articleForm: {
        title: 'Update Me',
        status: ArticleStatus.PUBLISHED,
        author: 'Alice',
        content: 'Some content',
        summary: 'A summary'
      },
      editingArticle: { id: 5 }
    })
    expect(screen.getByDisplayValue('Update Me')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Alice')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Some content')).toBeInTheDocument()
    expect(screen.getByDisplayValue('A summary')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveTextContent(/update article/i)
  })

  it('shows error messages for required fields', () => {
    renderForm({
      formErrors: {
        title: 'Title Required',
        author: 'Author Missing',
        content: 'Content Empty'
      }
    })
    expect(screen.getByText('Title Required')).toBeInTheDocument()
    expect(screen.getByText('Author Missing')).toBeInTheDocument()
    expect(screen.getByText('Content Empty')).toBeInTheDocument()
  })

  it('calls onFormChange for text input', async () => {
    const onFormChange = vi.fn();
    renderForm({ onFormChange });
    const titleInput = screen.getByLabelText(/title/i);
    await userEvent.type(titleInput, 'New Title');
    expect(onFormChange).toHaveBeenCalled();
    expect(screen.getByDisplayValue('New Title')).toBeInTheDocument();
  });

  it('calls onFormChange for textarea', async () => {
    const onFormChange = vi.fn();
    renderForm({ onFormChange });
    const contentInput = screen.getByLabelText(/content/i);
    await userEvent.type(contentInput, 'My Content');
    expect(onFormChange).toHaveBeenCalled();
    expect(screen.getByDisplayValue('My Content')).toBeInTheDocument();
  });

  it('calls onFormChange for select', async () => {
    const onFormChange = vi.fn();
    renderForm({ onFormChange });
    const statusSelect = screen.getByLabelText(/status/i);
    await userEvent.selectOptions(statusSelect, ArticleStatus.PUBLISHED);
    expect(onFormChange).toHaveBeenCalled();
    expect(screen.getByDisplayValue('Published')).toBeInTheDocument();
  });

  it('calls onSubmit when the form is submitted', async () => {
    const onSubmit = vi.fn(e => e.preventDefault());
    renderForm({
      onSubmit,
      articleForm: {
        title: 'Valid',
        author: 'Valid',
        content: 'Valid',
        summary: 'Valid',
        status: ArticleStatus.DRAFT,
      }
    });
    await userEvent.click(screen.getByRole('button', { name: /create article/i }));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('does not call onSubmit when required fields are missing', async () => {
    const onSubmit = vi.fn(e => e.preventDefault());
    renderForm({ onSubmit }); // Renders with empty form
    await userEvent.click(screen.getByRole('button', { name: /create article/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid author name', async () => {
    renderForm();
    const authorInput = screen.getByLabelText(/author/i);
    await userEvent.type(authorInput, '123');
    await userEvent.click(screen.getByRole('button', { name: /create article/i }));
    expect(await screen.findByText('Author name can only contain letters and spaces')).toBeInTheDocument();
  });
});
