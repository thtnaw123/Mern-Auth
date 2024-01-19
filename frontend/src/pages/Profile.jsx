import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../Components/FormContainer";
import { useUpdateProfileMutation } from "../features/usersApiSlice";
import { toast } from "react-toastify";
import Loader from "../Components/Loader";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { selectUserInfo } from "../features/authSlice";
import { setCredentials } from "../features/authSlice";

const Register = () => {
  const UserInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();

  const [name, setName] = useState(UserInfo?.name);
  const [email, setEmail] = useState(UserInfo?.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("the password must matche");
      return;
    }
    try {
      const res = await updateProfile({
        _id: UserInfo._id,
        name,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("profile updated");
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <h1>Profile</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-2" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        {isLoading && <Loader />}

        <Button type="submit" variant="primary" className="mt-3">
          Update
        </Button>
      </Form>
    </FormContainer>
  );
};

export default Register;
