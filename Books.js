import { useState } from 'react';
import {Row, Col, Input, Button, message, Typography, DatePicker} from 'antd';
import '../Assets/Post.css';
import dayjs from 'dayjs';
import {BookFilled} from '@ant-design/icons';
const {Text, Title} = Typography;

const Books = () => {

    const [input, setInput] = useState({});

    const handleInput = (e) =>{
        const {name, value} = e.target;
        setInput({...input, [name]:value});
    }

    const handleSubmit = async(e) =>{
        try{
            e.preventDefault();
            const response = await fetch("http://localhost:5000/book",{
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
        setInput({ ...input, added_date: dateString });
    };
    return (
        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <Title level={4}><BookFilled /> Library Management</Title>
                    <Row className="custom-row">
                        <Col className="custom-col">
                            <Text>Title: </Text>
                        </Col>
                        <Col className="custom-col">
                            <Input placeholder='Enter book title'
                            name='title' value={input.title}
                            onChange={handleInput}
                            />
                        </Col>
                    </Row><br/>
                    <Row className="custom-row">
                        <Col className="custom-col">
                            <Text>Publisher: </Text>
                        </Col>
                        <Col className="custom-col">
                            <Input placeholder='Enter book publisher name'
                            name='publisher' value={input.publisher}
                            onChange={handleInput}
                            />
                        </Col>
                    </Row><br/>
                    <Row className="custom-row">
                        <Col className="custom-col">
                            <Text>Author: </Text>
                        </Col>
                        <Col className="custom-col">
                            <Input placeholder='Enter book author name'
                            name='author' value={input.author}
                            onChange={handleInput}
                            />
                        </Col>
                    </Row><br/>
                    <Row className="custom-row">
                        <Col className="custom-col">
                            <Text>Category: </Text>
                        </Col>
                        <Col className="custom-col">
                            <Input placeholder='Enter book category'
                            name='category' value={input.category}
                            onChange={handleInput}
                            />
                        </Col>
                    </Row><br/>
                    <Row className="custom-row">
                        <Col className="custom-col">
                            <Text>Quantity: </Text>
                        </Col>
                        <Col className="custom-col">
                            <Input placeholder='Enter book category'
                            name='quantity' value={input.quantity}
                            onChange={handleInput}
                            />
                        </Col>
                    </Row><br/>
                    <Row className="custom-row">
                        <Col className="custom-col">
                            <Text>Available Copies: </Text>
                        </Col>
                        <Col className="custom-col">
                            <Input placeholder='Enter book category'
                            name='available' value={input.available}
                            onChange={handleInput}
                            />
                        </Col>
                    </Row><br/>
                    <Row className="custom-row">
                        <Col className="custom-col">
                            <Text>Publish Date: </Text>
                        </Col>
                        <Col className="custom-col">
                            <DatePicker placeholder='enter book purchase date'
                            format={'YYYY-MM-DD'}
                            name='added_date' value={input.added_date ? dayjs(input.added_date) : null}
                            onChange={handleDateChange}/>
                        </Col>
                    </Row><br/>
                    <Row className="custom-row">
                        <Col className="custom-col">
                            <Button type='primary' 
                            style={{marginLeft: '60px'}}
                            htmlType="submit">Save</Button>
                        </Col>
                    </Row>
                </form>
            </div>
        </>
    );
};

export default Books;