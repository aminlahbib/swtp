package com.equipment.dto;

public class AuthReset {
        private String message;

        public AuthReset(String message) {
            this.message = message;
        }

        // Getter
        public String getMessage() {
            return message;
        }

        // Setter
        public void setMessage(String message) {
            this.message = message;
        }
    }

