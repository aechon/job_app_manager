import { useState } from "react";
import { useDispatch } from "react-redux";

function ContactForm() {
  const dispatch = useDispatch();
  const [name, setname] = useState("");
  const [phone, setphone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  };
}
