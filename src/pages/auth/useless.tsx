import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { Form, Input, Button, Dialog, Space, Picker} from 'antd-mobile'
import './index.less'

const applyObj = {
  bpmDefKey: "",
  contentList: [
    {
      contentList: [],
      objectId: ""
    }
  ],
  formId: "",
  version: 0
}

function ApplicationPage(props) {
  const ref = useRef();

  const [form] = Form.useForm()

  const dispatch = props.dispatch
  let formObjectList = [] // 初始表单结构
  let version = 0 // 版本
  const timeOption = [
    {
      title: '0.5小时',
      key: 0,
      value: '0.5小时',
    },
    {
      title: '1小时',
      key: 1,
      value: '1小时',
    },
    {
      title: '1.5小时',
      key: 2,
      value: '1.5小时',
    },
  ]
  // const [ formObjectList, setFormObjectList] = useState([]); 
  // const [ version, setVersion] = useState(0); 
  const [ applyUserInfo, setApplyUserInfo] = useState({}) // 申请人信息
  const [ customerTypeVisible, setCustomerTypeVisible] = useState(false)
  const [ customerTypeOption, setCustomerTypeOption] = useState([]); // 客户类型
  const [ leaderVisible, setLeaderVisible] = useState(false) // 陪同领导
  const [ applyTypeOption, setApplyTypeOption] = useState([]); // 申请类别
  const [ meetingOption, setMeetingOption] = useState({}); // 会议室
  const [ meetingVisible, setMeetingVisible] = useState(false)
  const [ meetingServeOption, setMeetingServeOption] = useState() // 会议服务
  const [ meetingServeVisible, setMeetingServeVisible] = useState(false)
  const [ focusOption, setFocusOption] = useState([]) // 需重点讲解专区
  const [ welcomeSpeech, setWelcomeSpeech] = useState({}) // 欢迎词
  const [ demand, setDemand] = useState({})// 展示需求描述
  const [ promise,setPromise] = useState('') // 防疫要求
  const [ promiseStatus, setPromiseStatus] = useState(false) // 承诺项
  const [ value, setValue] = useState([])
  const [ valueInForm, setValueInForm] = useState('')


  /**获取最新表单*/
  // formId: '1534780166231883778',
  const getFormObject = () => {
    let params = {
      formId: '1534780166231883778'
    }
    // Axios('get', 'formObject', params).then(res=>{
    //   if(res.success) {
    //     formObjectList = res.result.objectList
    //     version = res.result.version
    //     getApplyUserInfo() //获取申请人信息
    //     getRealForm() //初始化处理表格
    //     // handleLinkOption()
    //   } else {

    //   }
    // }).catch(()=>{
    // })
  }

  /**获取申请人相关信息*/
  const getApplyUserInfo = () => {
    // TODO
    setApplyUserInfo({
      unit: '产业互联网研究院',
      userName: '张三',
      phone: '18602201234',
      depart: '市场运营部'
    })
    form.setFieldsValue({
      unit: '产业互联网研究院',
      userName: '张三',
      phone: '18602201234',
      depart: '市场运营部'
    })
  }

  /**初始化处理表格*/
  const getRealForm = () => {
    // 客户类型 2 3
    let client1 = formObjectList[2].optionList.map(item=>{
      return {
        label: item.content,
        key: item.temporaryId,
        value: item.content
      }
    })
    let client2 = formObjectList[3].optionList.map(item=>{
      return {
        label: item.content,
        key: item.temporaryId,
        value: item.content
      }
    })
    setCustomerTypeOption([client1,client2])
    // 申请类别 11 
    setApplyTypeOption(formObjectList[11].optionList.map(item=>{
      return {
        label: item.content,
        value: item.content,
        id: item.temporaryId,
        linkId: item.linkId
        // value: {
        //   content: item.content,
        //   objectId: item.objectId,
        //   temporaryId:item.temporaryId,
        //   linkId: item.linkId
        // }
      }
    }))
    // 会议室 13 与申请类别中会议服务联动
    setMeetingOption(formObjectList[13].optionList.map(item=>{
      return {
        label: item.content,
        value: item.content,
        id: item.temporaryId
      }
    }))
    setMeetingVisible(formObjectList[13].linked ? false: true)
    // 会议服务 12 与申请类别中会议服务联动
    setMeetingServeOption(formObjectList[12].optionList.map(item=>{
      return {
        label: item.content,
        value: item.content,
        id: item.temporaryId
      }
    }))
    setMeetingServeVisible(formObjectList[12].linked ? false: true)
    // 需重点讲解专区 14
    setFocusOption(formObjectList[14].optionList.map(item=>{
      return {
        label: item.content,
        value: item.content,
        id: item.temporaryId
      }
    }))
    // 欢迎词 15
    setWelcomeSpeech({
      maxLength: formObjectList[15].total,
      placeholder: formObjectList[15].optionList[0].content
    })
    // 展示需求描述 16
    setDemand({
      maxLength: formObjectList[16].total,
      placeholder: formObjectList[16].optionList[0].content
    })
    // 防疫要求 17
    setPromise(formObjectList[17].optionList[0].content)
  }


  /**处理关联项*/
  const handleLinkOption = () => {
    
  } 

  useEffect(() => {
    getFormObject()
  },[]);  //重点 []

  const onFinish = (values) => {
    Dialog.alert({
      content: <pre>{JSON.stringify(values, null, 2)}</pre>,
    })
  }

  return (
    <>
      <div >
        {/* <Top
          param={{
            title: {
                value: '预约申请',
                show: true
            },
            serviceShow: false,
            backShow: true
          }}
      /> */}
      </div>
      <div>
        <Form
          layout='horizontal'
          form={form}
          initialValues={applyUserInfo}
          onFinish={onFinish}
          footer={
            <Button block type='submit' color='primary'>
              提交
            </Button>
          }
        >
          <Form.Header />
          <Form.Item label='申请单位' name="unit" disabled>
            <Input placeholder='请输入' />
          </Form.Item>
          <Form.Item label='申请人' name="userName" disabled>
            <Input placeholder='请输入' />
          </Form.Item>
          <Form.Item label='联系电话' name="phone" disabled>
            <Input placeholder='请输入' />
          </Form.Item>
          <Form.Item label='归属部门' name="depart" disabled>
            <Input placeholder='请输入' />
          </Form.Item>
          <div style={{height: '1rem',background: '#F2F6F8'}}></div>
          <Form.Header />
          <Form.Item label='客户名称' name="customerName" required 
            rules={[{ required: true, message: '请输入' }]}>
            <Input placeholder='请输入' />
          </Form.Item>     
          <Form.Item label='客户类别' name='customerType' required trigger='onConfirm' onClick={(e:any, ref:any) => { 
            ref.current?.open() 
            }}>
            <Picker columns={customerTypeOption} >
              {value => value.every(item => item === null) ? '请选择' : value.map(item => item?.label).join('-')}
            </Picker>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}



export default ApplicationPage;
