import React, { useEffect, useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, CalendarOutlined, DoubleRightOutlined, UnorderedListOutlined, SettingOutlined, AntDesignOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, theme, Input, Card, Modal, Form, DatePicker, ColorPicker, Col, Row } from 'antd';
import { firestore } from '../../../config/firebase';
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
const { Sider, Content } = Layout;

const initState = { title: '', description: '', date: '' }

export default function StickyHome() {
  const today = new Date().toISOString().split('T')[0];
  const [collapsed, setCollapsed] = useState(false);
  const [searchVisible, setSearchVisible] = useState(true);
  const { token: { colorBgContainer } } = theme.useToken();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, setState] = useState(initState)
  const [fetch, setFetch] = useState([])
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null); //step 1

  const { Search } = Input;
  const { TextArea } = Input;
  const onSearch = (value) => console.log(value);

  const upcomingNotes = fetch.filter(item => item.userData.date > today);
  const todayNotes = fetch.filter(item => item.userData.date === today);
  const calender = fetch.filter(item => item.userData.date === selectedDate)

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    setSearchVisible(true);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color.toHex());
  };
  const handleOk = async () => {
    const { title, description, date } = state
    const userData = { title, description, date, color: selectedColor, id: Math.random().toString(36).slice(2) };

    try {
      await setDoc(doc(firestore, "stickyUser", userData.id), { userData });
      console.log("data stored in fire base Successfully")
    }
    catch (error) {
      console.error(error)
    }

    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleDateAndColor = (fieldName, value) => {
    setState((prevState) => ({ ...prevState, [fieldName]: value }));
  }

  const handleChange = (event) => {
    setState((prevState) => ({ ...prevState, [event.target.name]: event.target.value }))

  }

  const fetchData = async () => {
    try {
      let data = [];
      const querySnapshot = await getDocs(collection(firestore, "stickyUser"));
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        data.push(userData);
        console.log(doc.id, " => ", doc.data());
      });
      // console.log("Fetched data:", data); 
      setFetch(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (itemId) => {
    try {
      // Delete the document with the specified itemId from Firestore
      await deleteDoc(doc(firestore, "stickyUser", itemId));
      // await doc(firestore, "stickyUser", itemId).delete();
      console.log("Document successfully deleted!");

      // Fetch data again to update the UI
      fetchData();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const getFilteredNotes = () => {
    if (selectedCategory === 'upcoming') {
      return upcomingNotes;
    } else if (selectedCategory === 'today') {
      return todayNotes;
    }  else if (selectedCategory === 'calender') {
      return calender;
    }else {
      return fetch;
    }
  };

  // const handleSideDate = (fieldName, value) => {
  //   setSelectedDate((prevState) => ({ ...prevState, [fieldName]: value }))
  //   console.log("Date", value)
  // }

  const handleSideDate = (date) => {
    setSelectedDate(date);
  };
  return (
    <>
      <div className="center-container">
        <div className="container">
          <Layout style={{ height: '100%' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} style={{ backgroundColor: '#f5f5f5' }}>
              <div className="demo-logo-vertical" />
              <h4>Manu</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {searchVisible && (<Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} />)}
                <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={toggleSidebar} style={{
                  fontSize: '16px', width: 64, height: 64, position: 'absolute', top: '-17px', right: '-25px'
                }}
                />
              </div>
              <Menu style={{ backgroundColor: '#f5f5f5' }} mode="inline" defaultSelectedKeys={['1']} selectedKeys={[selectedCategory]}>
                <h6 className='pt-3 pb-2'>TASKS</h6>
                <Menu.Item key="1" icon={<DoubleRightOutlined />} onClick={() => setSelectedCategory('upcoming')}>
                  Upcoming
                </Menu.Item>
                <Menu.Item key="2" icon={<MenuUnfoldOutlined />} onClick={() => setSelectedCategory('today')}>
                  Today
                </Menu.Item>
                <Menu.Item key="3">
                  <DatePicker onChange={(date, dateString) => handleSideDate(dateString)}  onClick={() => setSelectedCategory('calender')}/>
                </Menu.Item>
                <Menu.Item key="4" icon={<UnorderedListOutlined />} onClick={() => setSelectedCategory('all')}>
                  Sticky Wall
                </Menu.Item>
              </Menu>
              <h4></h4>
              <h6 className='pt-3 pb-2'>LISTS</h6>
              <Menu style={{ backgroundColor: '#f5f5f5' }}>
                <Menu.Item >
                  Person
                </Menu.Item>
                <Menu.Item >
                  Work
                </Menu.Item>
                <Menu.Item >
                  List
                </Menu.Item>
                <Menu.Item >
                  +Add New List
                </Menu.Item>
              </Menu>

              <Menu style={{ backgroundColor: '#f5f5f5' }} className='mt-5 mb-3'>
                <Menu.Item icon={<SettingOutlined />}>
                  Settings
                </Menu.Item>
                <Menu.Item icon={<AntDesignOutlined />} >
                  Sign Out
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <h4>Sticky Wall</h4>
              <Content style={{ margin: '24px 16px', padding: 24, backgroundColor: '#f5f5f5', maxHeight: 'calc(100vh - 48px)', overflowY: 'auto' }}>

                <Card onClick={showModal} style={{ width: '150px', cursor: 'pointer' }}>
                  <h3 className='text-center'>+</h3>
                </Card>
                <Modal title="Sticky Wall" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                  <Form>
                    <Form.Item label="Title" >
                      <Input name="title" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Description"  >
                      <TextArea rows={4} name="description" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Date"  >
                      <DatePicker name="date" onChange={(date, dateString) => handleDateAndColor('date', dateString)} />
                    </Form.Item>
                    <Form.Item label='Color' >
                      <ColorPicker color={selectedColor} onChange={handleColorChange} />
                    </Form.Item>
                  </Form>
                </Modal>
                <div style={{ display: 'flex', flexWrap: 'wrap', }}>
                  {getFilteredNotes().map((item, index) => {
                    return (
                      <Col span={8} key={index} style={{ marginBottom: 16 }}>
                        <Card title={item?.userData?.title} className='me-4 mt-2' style={{ backgroundColor: `#${item?.userData?.color}` }}>
                          <p>{item?.userData?.description}</p>
                          <h6>{item?.userData?.date}</h6>
                          <h6>{item?.userData?.color}</h6>
                          <Button type='primary' onClick={() => handleDelete(item?.userData?.id)}>
                            delete
                          </Button>
                        </Card>
                      </Col>
                    )
                  })}
                </div>
              </Content>
            </Layout>
          </Layout>
        </div>
      </div>
    </>
  );
}
