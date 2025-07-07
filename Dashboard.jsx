import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import {Pie, Legend, ResponsiveContainer, Tooltip, PieChart, Cell } from 'recharts';
import Title from 'antd/es/typography/Title';
import SideBar from './SideBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBookOpen, faBookOpenReader, faCircleUser } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {

    const [user, setUser] = useState(0);
    const [totalAvailable, setTotalAvailable] = useState(0);
    const [totalBooks, setTotalBooks] = useState(0);
    const [bbooks, setBbooks] = useState(0);
    const [rbook, setRbook] = useState(0);

    const FetchChart = async()=>{
            try{
                const response = await fetch("http://localhost:5000/dashboard", {
                    method: "GET", 
                });
                const jsonData = await response.json();
                console.log("Data",jsonData)
                setUser(jsonData.active_user)
                setTotalAvailable(jsonData.availableBook[0].totalAvailable)
                setTotalBooks(jsonData.availableBook[0].totalBooks)
                setBbooks(jsonData.books[0].count)
                
            } catch(error){
                console.log(error);
            }
        }

    

    useEffect(()=>{
        FetchChart();
    },[])

    const pieData = [
        { name: 'Total Books Copies', value: totalBooks},
        { name: "Available Book Copies", value: totalAvailable},
        { name: "Borrowed Book", value: totalBooks - totalAvailable}
        ];
    return (
        <>
        <SideBar/>
            <div style={{display: 'flex', gap:'40px',
                backgroundColor: '#471396', paddingLeft: '50px'
            }}>
                
                    <Card title="Available vs Total Book Copies" 
                        hoverable
                        style={{ width:"75%", marginTop: '70px', backgroundColor: '#f7d6c0' , 
                            
                        }}>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                data={pieData}
                                cx={"50%"}
                                cy={"50%"}
                                innerRadius={90}
                                outerRadius={110}
                                fill='#8884d8'
                                dataKey={'value'}
                                label
                                >
                                    {pieData.map((entry, index)=>(
                                        <Cell key={`cell-${index}`} fill={['#003366', '#4CAF50', '#FF0000'][index % 3]}/>
                                    ))}
                                </Pie>
                                <Tooltip/>
                                <Legend/>
                            </PieChart>
                        </ResponsiveContainer>
                </Card> 
                
                <div style={{display: 'flex', gap: '20px', flexDirection: 'row', 
                    marginTop: '18px', flexWrap: 'wrap'}}>
                    <Card hoverable 
                    style={{width: '290px', height: '180px', 
                    backgroundColor: '#9619b2',borderRadius: '20px',
                    marginTop: "50px",}}>
                        <Title level={4}>Total User </Title>
                        <Title level={3} style={{display: 'flex', justifyContent: 'space-between'
                            }}>{user} 
                            <FontAwesomeIcon icon={faCircleUser} fontSize={'30pt'} />
                        </Title>
                        
                    </Card>
                    <Card hoverable 
                    style={{width: '290px', height: '180px', 
                    backgroundColor: '#4169E1',
                    borderRadius: '20px',
                    marginTop: "50px",}}>
                        <Title level={4}>Total Books</Title>
                        <Title level={3} style={{display: 'flex', justifyContent: 'space-between'}}>{totalBooks}
                            <FontAwesomeIcon icon={faBook} fontSize={'30pt'}/>
                        </Title>
                    </Card>
                    <Card hoverable 
                    style={{width: '290px', height: '180px', marginTop: "50px", 
                        backgroundColor: '#04d010',borderRadius: '20px'
                    }}>
                        <Title level={4}>Available Books</Title>
                        <Title level={3} style={{display: 'flex', justifyContent: 'space-between'}}>{totalAvailable}
                            <FontAwesomeIcon icon={faBookOpen} fontSize={'30pt'}/>
                        </Title>
                    </Card>
                    <Card hoverable 
                    style={{width: '290px', height: '180px', marginTop: "50px",
                        backgroundColor: '#FF2929',borderRadius: '20px'
                    }}>
                        <Title level={4}>Borrowed Books</Title>
                        <Title level={3} style={{display: 'flex', justifyContent: 'space-between'}}>{bbooks}
                            <FontAwesomeIcon icon={faBookOpenReader} fontSize={'30pt'}/>
                        </Title>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Dashboard;