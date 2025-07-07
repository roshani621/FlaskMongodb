import { Button, Drawer } from 'antd';
import React, { useState } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faBell, faBook, faBookOpen, faLayerGroup, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Title from 'antd/es/typography/Title';
import Search from 'antd/es/input/Search';
import Text from 'antd/es/typography/Text'
import '../Assets/Custome.css';

const SideBar = () => {

    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [text, setText] = useState([]);
    const [loading, setLoading] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const handleClick= async()=>{
        setLoading(true);
        try{
            const response = await fetch("http://localhost:5000/search",{
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({text: input})
            });
            const data = await response.json();
            setText(data);
            console.log(data)
        } catch(error){
            console.log(error);
        } finally{
            setLoading(false);
        }
    }
    return (
        <>
            <div style={{display: 'flex', gap: '200px',
                padding: '20px',
                backgroundColor: '#471396'}}>
                <Button onClick={showDrawer}>
                    <FontAwesomeIcon icon={faBook} style={{fontSize: '12pt'}}/>
                </Button>
                <Search placeholder='Search here....'
                style={{width: '300px', borderRadius: '50px'}}
                value={input}
                onChange={(e)=>{setInput(e.target.value)}}
                onSearch={handleClick}
                />
            </div>
            <div>
                
                <div style={{backgroundColor: '#471396'}} className='serach'>
                    {loading? <p>Searching...</p>: (
                        text.map((book)=>(
                            <div key={book._id} style={{marginLeft: '300px'}} >
                                <Text style={{color: 'white', fontSize: '13pt'}}>Title: {book.title}</Text><br/>
                                <Text style={{color: 'white', fontSize: '13pt'}}>Category: {book.category}</Text>
                            </div>
                    ))
                    )}
                </div>
                <Drawer
                title="Dashboard"
                open={open}
                onClose={onClose}
                placement='left'
                style={{
                    width: '250px',
                    backgroundColor: '#1B3C53',
                    color: 'white'
                }}
                >
                    <div className='menu'>
                        <Title level={5}><FontAwesomeIcon icon={faLayerGroup}/> Category</Title>
                        <Title level={5}><FontAwesomeIcon icon={faBookOpen}/> My Borrow Book</Title>
                        <Title level={5}><FontAwesomeIcon icon={faBell}/> Notification</Title>
                        <Title level={5}><FontAwesomeIcon icon={faUserCircle}/> Profile </Title>
                    </div>

                </Drawer>
                
            </div>
        </>
    );
};

export default SideBar;