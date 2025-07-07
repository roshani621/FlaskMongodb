import { useState } from 'react';
import {Row, Col, Input, Button, message, Typography, DatePicker, Form} from 'antd';
import '../Assets/Post.css';
import dayjs from 'dayjs';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
const {Text, Title} = Typography;

const Users = () => {

    const [input, setInput] = useState({});

    const handleInput = (e) =>{
        const {name, value} = e.target;
        setInput({...input, [name]:value});
    }

    const handleSubmit = async(e) =>{
        try{
            e.preventDefault();
            const response = await fetch("http://localhost:5000/user",{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(input)
            });
            const data = await response.json();
            setInput(data);
            console.log("Data: ", data);
            message.success("Book registered successfully")
        } catch(error){
            console.log(error);
            message.error("Failed to submit")
        }
    }

    const handleDateChange = (date, dateString) => {
        setInput({ ...input, membership_date: dateString });
    };
    return (
            <div style={{margin:'50px', textAlign: 'center'}}>
                <form onSubmit={handleSubmit}>
                    <Title level={4}><FontAwesomeIcon icon={faUser} /> User Details</Title>
                    <Row className="custom-row">
                        <Col className="custom-col">
                            <Text>Name: </Text>
                        </Col>
                        <Col className="custom-col">
                            <Input placeholder='Enter your name'
                            name='name' value={input.name}
                            onChange={handleInput}
                            />
                        </Col>
                    </Row><br/>
                    <Row className="custom-row">
                        <Col className="custom-col">
                            <Text>Email: </Text>
                        </Col>
                        <Col className="custom-col">
                            <Input placeholder='Enter your email'
                            type='email'
                            name='email' value={input.email}
                            onChange={handleInput}
                            />
                        </Col>
                    </Row><br/>
                    <Row className="custom-row">
                        <Col className="custom-col">
                            <Text>Phone: </Text>
                        </Col>
                        <Col className="custom-col">
                            <Input placeholder='Enter your name'
                            name='phone' value={input.phone}
                            onChange={handleInput}
                            />
                        </Col>
                    </Row><br/>
                    
                    <Row className="custom-row">
                        <Col className="custom-col">
                            <Text>Date: </Text>
                        </Col>
                        <Col className="custom-col">
                            <DatePicker placeholder="Enter membership date"
                            showTime
                                name="membership_date"
                                format={'YYYY-MM-DD HH:mm:ss'}
                                value={input.membership_date ? dayjs(input.membership_date): null}
                                onChange={handleDateChange}/>
                        </Col>
                    </Row><br/>
                    <Row className="custom-row">
                        <Col className="custom-col">
                            <Button type='primary' 
                            style={{marginLeft: '60px'}}
                            htmlType="submit">Register</Button>
                        </Col>
                    </Row>
                </form>
            </div>
    );
};

export default Users;