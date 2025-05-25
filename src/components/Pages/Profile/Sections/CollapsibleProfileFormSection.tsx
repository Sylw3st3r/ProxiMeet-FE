import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { Formik, Form } from "formik";
import { ReactNode } from "react";

interface ProfileSectionParams<T extends string, V> {
  title: string;
  initialValues: Record<T, V | null>;
  validationSchema: any;
  children: ReactNode;
  onSubmit: (submitData: Record<T, V>) => void;
}

export default function CollapsibleProfileFormSection<T extends string, V>({
  title,
  initialValues,
  validationSchema,
  children,
  onSubmit,
}: ProfileSectionParams<T, V>) {
  return (
    <Accordion disableGutters>
      <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 2 }}>
        <Typography fontWeight={600}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => onSubmit(values as Record<T, V>)}
        >
          {({ dirty }) => (
            <Form>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {children}
                {dirty && (
                  <Box textAlign="right">
                    <Button type="submit" variant="contained">
                      Save
                    </Button>
                  </Box>
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </AccordionDetails>
    </Accordion>
  );
}
