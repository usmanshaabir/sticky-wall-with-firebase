import React, { useEffect, useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, CalendarOutlined, DoubleRightOutlined, UnorderedListOutlined, SettingOutlined, AntDesignOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, theme, Input, Card, Modal, Form, DatePicker, ColorPicker, Col, Row } from 'antd';
import { firestore } from '../../../config/firebase';
import moment from 'moment';
import { Checkbox } from 'antd';
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
const { Sider, Content } = Layout;


const initState = { title: '', description: '', date: '' }

export default function StickyHome() {
  const today = new Date().toISOString().split('T')[0];
  const [collapsed, setCollapsed] = useState(false);
  const [searchVisible, setSearchVisible] = useState(true);
  const { token: { colorBgContainer } } = theme.useToken();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [state, setState] = useState(initState)
  const [updateData, setUpdateData] = useState(initState);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [fetch, setFetch] = useState([])
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null); //step 1
  const [selectedTag, setSelectedTag] = useState(null);


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
  const showModalUpdate = (data) => {
    setUpdateData(data);
    setIsModalUpdate(true);
  };

  const handleCancelUpdate = () => {
    setIsModalUpdate(false);
  }
  const handleOk = async () => {
    const { title, description, date } = state
    const userData = { title, description, date, color: selectedColor, checkboxes: selectedCheckboxes, id: Math.random().toString(36).slice(2) };

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
      await deleteDoc(doc(firestore, "stickyUser", itemId));
      console.log("Document successfully deleted!");
      fetchData();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };
  const handleSideDate = (date) => {
    setSelectedDate(date);
  };
  const handleChangeUpdate = (event) => {
    const { name, value } = event.target;
    setUpdateData((prevData) => ({ ...prevData, [name]: value, }));
  };

  const handleDateAndColorUpdate = (fieldName, value) => {
    setUpdateData((prevData) => ({ ...prevData, [fieldName]: value, }));
  };

  const handleColorChangeUpdate = (color) => {
    setUpdateData((prevData) => ({ ...prevData, color: color.toHex(), }));
  };
  const handleOkUpdate = async () => {
    // Update the data in Firestore using updateDoc function
    try {
      const noteRef = doc(firestore, "stickyUser", updateData.id);
      await updateDoc(noteRef, { userData: updateData });
      console.log("Document successfully updated!");
      setIsModalUpdate(false);
      fetchData();
    } catch (error) {
      console.error("Error updating document: ", error);
    }
    setIsModalUpdate(false);
  };
  // const handleCheckBox = (CheckboxChangeEvent) => {
  //   console.log(`checked = ${CheckboxChangeEvent.target.checked}`);
  // };
  const handleCheckBox = (CheckboxChangeEvent, value) => {
    const checkboxValue = CheckboxChangeEvent.target.value;
    if (CheckboxChangeEvent.target.checked) {
      setSelectedCheckboxes((prevSelected) => [...prevSelected, checkboxValue]);
    } else {
      setSelectedCheckboxes((prevSelected) =>
        prevSelected.filter((item) => item !== checkboxValue)
      );
    }
  };
  const handlePersonal = (tag) => {
    setSelectedTag(tag);
  };
  const getFilteredNotes = () => {
    if (selectedCategory === 'upcoming') {
      return upcomingNotes.filter(item => !selectedTag || item.userData.checkboxes.includes(selectedTag));
    } else if (selectedCategory === 'today') {
      return todayNotes.filter(item => !selectedTag || item.userData.checkboxes.includes(selectedTag));
    } else if (selectedCategory === 'calender') {
      return calender.filter(item => !selectedTag || item.userData.checkboxes.includes(selectedTag));
    } else {
      return fetch.filter(item => !selectedTag || item.userData.checkboxes.includes(selectedTag));
    }
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
                  <DatePicker onChange={(date, dateString) => handleSideDate(dateString)} onClick={() => setSelectedCategory('calender')} />
                </Menu.Item>
                <Menu.Item key="4" icon={<UnorderedListOutlined />} onClick={() => setSelectedCategory('all')}>
                  Sticky Wall
                </Menu.Item>
              </Menu>
              <h4></h4>
              <h6 className='pt-3 pb-2'>LISTS</h6>
              <Menu style={{ backgroundColor: '#f5f5f5' }}>
                <Menu.Item>
                  <div style={{ position: "relative" }}>
                    <div style={{ backgroundColor: '#ff6864', width: '20px', height: '20px' }}>
                      <span
                        style={{ position: 'absolute', top: '-12px', right: '80px' }}
                        onClick={() => handlePersonal('Personal')}>
                        Personal
                      </span>
                    </div>
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div style={{ position: "relative" }}>
                    <div style={{ backgroundColor: '#75d8eb', width: '20px', height: '20px' }}>
                      <span
                        style={{ position: 'absolute', top: '-12px', right: '97px' }}
                        onClick={() => handlePersonal('Work')}
                      >
                        Work
                      </span>
                    </div>
                  </div>
                </Menu.Item>

                <Menu.Item>
                  <div style={{ position: "relative" }}>
                    <div style={{ backgroundColor: '#f5cf56', width: '20px', height: '20px', }}><span style={{ position: 'absolute', top: '-12px', right: '105px' }}>List</span></div>
                  </div>
                </Menu.Item>
                <Menu.Item>
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
                <div style={{ display: 'flex', flexWrap: 'wrap', }}>
                  {getFilteredNotes().map((item, index) => {
                    return (
                      <Col span={8} key={index} style={{ marginBottom: 16 }}>
                        <Card title={item?.userData?.title} className='me-4 mt-2' style={{ backgroundColor: `#${item?.userData?.color}` }}>
                          <p>{item?.userData?.description}</p>
                          <h6>{item?.userData?.date}</h6>
                          <div className="checkbox-container">
                            {item?.userData?.checkboxes?.map((checkboxValue) => (
                              <span key={checkboxValue} className={checkboxValue === "Personal" ? 'checkbox-value' : "checkbox-values"}>
                                {checkboxValue}
                              </span>
                            ))}
                          </div>
                          <div className='d-flex justify-content-between'>
                            <Button type='primary' onClick={() => handleDelete(item?.userData?.id)}>
                              Delete
                            </Button>
                            <Button type='primary' style={{ backgroundColor: 'green', color: 'white' }} onClick={() => showModalUpdate(item?.userData)}>
                              Update
                            </Button>
                          </div>
                        </Card>
                      </Col>
                    )
                  })}

                  <Card onClick={showModal} style={{ width: '290px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='mt-2 mb-3'>
                    <h3 style={{ fontSize: "70px" }} >+</h3>
                  </Card>
                </div>
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
                    <Checkbox value="Personal" onChange={(e) => handleCheckBox(e, "Personal")}>
                      Personal
                    </Checkbox>
                    <Checkbox value="Work" onChange={(e) => handleCheckBox(e, "Work")}>
                      Work
                    </Checkbox>

                  </Form>
                </Modal>
                <Modal title="Update Sticky Note" open={isModalUpdate} onOk={handleOkUpdate} onCancel={handleCancelUpdate}>
                  <Form>
                    <Form.Item label="Title">
                      <Input name="title" value={updateData.title} onChange={handleChangeUpdate} />
                    </Form.Item>
                    <Form.Item label="Description">
                      <TextArea rows={4} name="description" value={updateData.description} onChange={handleChangeUpdate} />
                    </Form.Item>
                    <Form.Item label="Date">
                      <DatePicker
                        name="date" value={updateData.date ? moment(updateData.date) : null}
                        onChange={(date, dateString) => handleDateAndColorUpdate('date', dateString)}
                      />
                    </Form.Item>
                    <Form.Item label='Color'>
                      <ColorPicker color={`#${updateData?.color}`} onChange={handleColorChangeUpdate} />
                    </Form.Item>
                  </Form>
                </Modal>
              </Content>
            </Layout>
          </Layout>
        </div>
      </div >
    </>
  );
}
