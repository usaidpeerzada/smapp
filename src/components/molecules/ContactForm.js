import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Input,
  TextArea,
  Button,
  Text,
  Box,
  VStack,
  useToast,
  Modal,
} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import * as EmailValidator from "email-validator"; // Optional: for email validation
import axios from "axios";
const RESEND_API_URL = "https://api.resend.com/send";
const API_KEY = "YOUR_RESEND_API_KEY";

export default function ContactFormModal({ isVisible, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      toast.show({
        description: "Please fill in all fields.",
        status: "warning",
      });
      return;
    }

    if (!EmailValidator.validate(email)) {
      toast.show({
        description: "Please enter a valid email address.",
        status: "warning",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        RESEND_API_URL,
        {
          to: "recipient@example.com", // Replace with the recipient email address
          subject: "Contact Form Submission",
          text: `
          Name: ${name}
          Email: ${email}
          Message: ${message}
        `,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.show({
          description: "Your message has been sent successfully!",
          status: "success",
        });
        // Clear form fields
        setName("");
        setEmail("");
        setMessage("");
        onClose(); // Close the modal after successful submission
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast.show({
        description: `Thanks, we will get back to you soon.`,
        status: "error",
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isVisible} onClose={onClose} size="lg">
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Contact Us</Modal.Header>
        <Modal.Body>
          <Box style={styles.formContainer}>
            <VStack space={4} mt={4}>
              <Input
                placeholder="Your Name"
                value={name}
                onChangeText={setName}
                variant="outline"
                borderColor="#949dff"
                _focus={{ borderColor: "#949dff", borderWidth: 2 }}
                size="lg"
              />
              <Input
                placeholder="Your Email"
                value={email}
                onChangeText={setEmail}
                variant="outline"
                borderColor="#949dff"
                _focus={{ borderColor: "#949dff", borderWidth: 2 }}
                size="lg"
              />
              <TextArea
                placeholder="Your Message"
                value={message}
                onChangeText={setMessage}
                variant="outline"
                borderColor="#949dff"
                _focus={{ borderColor: "#949dff", borderWidth: 3 }}
                size="lg"
                h={150}
              />
              <Button
                onPress={handleSubmit}
                isLoading={isSubmitting}
                style={styles.submitButton}
              >
                Send Message
              </Button>
            </VStack>
          </Box>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    padding: 20,
  },
  submitButton: {
    backgroundColor: "#949dff",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
});
