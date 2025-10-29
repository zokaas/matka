import React, { useState } from 'react';
import {
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  TabGroup,
  TabPanels,
  TabPanel,
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
    <ModalLayout onClose={onClose} labelledBy="question-builder-title">
      <ModalHeader>
        <Typography id="question-builder-title" variant="beta">
          {question ? 'Edit Question' : 'Create New Question'}
        </Typography>
      </ModalHeader>

      <ModalBody>
        <TabGroup label="Question Builder Tabs" id="question-tabs">
          <Tabs>
            <Tab>Form</Tab>
            <Tab>Preview</Tab>
          </Tabs>
          <TabPanels>
            <TabPanel>
              <Box padding={4}>
                {validationErrors.length > 0 && (
                  <Box
                    padding={4}
                    marginBottom={4}
                    background="danger100"
                    borderColor="danger600"
                    hasRadius
                  >
                    <Typography variant="omega" textColor="danger700">
                      Validation Errors:
                    </Typography>
                    <ul>
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
              </Box>
            </TabPanel>
            <TabPanel>
              <Box padding={4}>
                <LivePreview question={formData} />
              </Box>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </ModalBody>

      <ModalFooter
        startActions={
          <Button onClick={onClose} variant="tertiary">
            Cancel
          </Button>
        }
        endActions={
          <Button onClick={handleSave} loading={isSaving}>
            {question ? 'Update' : 'Create'}
          </Button>
        }
      />
    </ModalLayout>
  );
};

export default QuestionBuilder;