import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Typography,
} from '@strapi/design-system';
import { useNotification } from '@strapi/strapi/admin';
import QuestionForm from './QuestionForm';
import LivePreview from './LivePreview';
import { createQuestion, updateQuestion } from '../../api/questions';

interface QuestionBuilderProps {
  question: any;
  locale: string;
  onClose: () => void;
}

const QuestionBuilder: React.FC<QuestionBuilderProps> = ({
  question,
  locale,
  onClose,
}) => {
  const [formData, setFormData] = useState(question || {
    questionParameter: '',
    questionLabel: '',
    componentType: 'Text',
    placeholder: '',
    options: [],
    dynamicField: [],
    errorMessages: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('form');
  const { toggleNotification } = useNotification();

  const handleSave = async () => {
    setIsSaving(true);
    setValidationErrors([]);

    try {
      if (question?.documentId) {
        await updateQuestion(question.documentId, formData, locale);
        toggleNotification({
          type: 'success',
          message: 'Question updated successfully',
        });
      } else {
        await createQuestion(formData, locale);
        toggleNotification({
          type: 'success',
          message: 'Question created successfully',
        });
      }
      onClose();
    } catch (error: any) {
      const errors = error.response?.data?.error?.details?.errors || [];
      setValidationErrors(errors);
      toggleNotification({
        type: 'danger',
        message: error.response?.data?.error?.message || 'Failed to save question',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <Box
        background="neutral0"
        hasRadius
        shadow="tableShadow"
        style={{
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
        onClick={(e: any) => e.stopPropagation()}
      >
        {/* Header */}
        <Box
          padding={4}
          borderColor="neutral200"
          style={{ borderBottom: '1px solid #eaeaea' }}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Typography variant="beta">
              {question ? 'Edit Question' : 'Create New Question'}
            </Typography>
            <Button variant="tertiary" onClick={onClose}>
              ✕
            </Button>
          </Flex>
        </Box>

        {/* Tab Navigation */}
        <Box padding={4} borderColor="neutral200" style={{ borderBottom: '1px solid #eaeaea' }}>
          <Flex gap={2}>
            <Button
              variant={activeTab === 'form' ? 'default' : 'tertiary'}
              onClick={() => setActiveTab('form')}
            >
              Form
            </Button>
            <Button
              variant={activeTab === 'preview' ? 'default' : 'tertiary'}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </Button>
          </Flex>
        </Box>

        {/* Content */}
        <Box padding={4} style={{ minHeight: '400px', maxHeight: 'calc(90vh - 200px)', overflow: 'auto' }}>
          {activeTab === 'form' && (
            <>
              {validationErrors.length > 0 && (
                <Box
                  padding={4}
                  marginBottom={4}
                  background="danger100"
                  hasRadius
                >
                  <Typography variant="omega" textColor="danger700" fontWeight="bold">
                    Validation Errors:
                  </Typography>
                  <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                    {validationErrors.map((error, index) => (
                      <li key={index}>
                        <Typography variant="omega" textColor="danger700">
                          {error}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
              
              <QuestionForm
                data={formData}
                onChange={setFormData}
                locale={locale}
              />
            </>
          )}

          {activeTab === 'preview' && (
            <LivePreview question={formData} />
          )}
        </Box>

        {/* Footer */}
        <Box
          padding={4}
          borderColor="neutral200"
          style={{ borderTop: '1px solid #eaeaea' }}
        >
          <Flex justifyContent="space-between">
            <Button onClick={onClose} variant="tertiary">
              Cancel
            </Button>
            <Button onClick={handleSave} loading={isSaving}>
              {question ? 'Update' : 'Create'}
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default QuestionBuilder;