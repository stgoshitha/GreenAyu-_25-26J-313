import React from "react";
import { motion } from "framer-motion";
import Container from "../../components/layout/Container";

export default function Page({ title, subtitle, children }) {
  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25 }}
    >
      {(title || subtitle) && (
        <Container className="page-head">
          {title && <h1 className="page-title">{title}</h1>}
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </Container>
      )}
      {children}
    </motion.div>
  );
}
