import React, { useEffect, useRef } from 'react'
import {
  Form,
  Input,
  Button,
  Dialog,
  TextArea,
  DatePicker,
  Selector,
  Slider,
} from 'antd-mobile'
import axios from 'axios'
import { setLocationStorage, getLocationStorage } from '../../utils/function'
import './index.less'
import { FormInstance } from 'antd-mobile/es/components/form'

export default () => {
  const formRef = useRef<FormInstance>()
  // 启动时检查本地
  useEffect(() => {
    console.log('bendi', getLocationStorage('loginInfo'), formRef)
    let info = getLocationStorage('loginInfo')
    if(formRef && formRef.current){
      formRef.current.setFieldsValue({
        ...info
      })
    }

  }, [])

  const onFinish = (values: any) => {
    const { backend, username, password } = values

    // axios(
    //   {url:`http://${backend}/open/auth/token?client_id=${id}&client_secret=${secret}`
    // })
    axios({
      url: `http://${backend}/api/login`,
      method: 'post',
      data: {
        username,
        password
      }
    })
      .then(res => {
        if (res.data.data.token) {
          Dialog.alert({
            content: '已本地保存token' + res.data.data.token
          })
          setLocationStorage('host', `http://${backend}`)
          setLocationStorage('loginInfo', values)
          setLocationStorage('token', res.data.data.token)
        } else {
          Dialog.alert({
            content: '获取token失败，请检查配置项',
          })
        }
      })
  }

  return (
    <div style={{ width: '100%', height: '90vh', margin: "0px auto", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Form
      ref={formRef}
        style={{ width: '90%', height: '60%' }}
        layout='horizontal' mode='card'
        onFinish={onFinish}
        footer={
          <Button block type='submit' className='login-btn'>
            提交
          </Button>
        }
      >
        <Form.Item
          name='backend'
          label='青龙后端'
          rules={[{ required: true, message: '青龙后端不能为空' }]}
        >
          <Input placeholder='青龙后端（ip:port）' />
        </Form.Item>

        <Form.Item name='username' label='用户名' rules={[{ required: true }]}>
          <Input placeholder='请输入' />
        </Form.Item>

        <Form.Item name='password' label='密码' rules={[{ required: true }]}>
          <Input placeholder='请输入' />
        </Form.Item>

        {/* <Form.Item name='id' label='CLIENT ID'>
              <Input placeholder='请输入clientid' />
        </Form.Item>

        <Form.Item name='secret' label='Client Secret'>
              <Input placeholder='请输入Client Secret' />
        </Form.Item> */}
      </Form>
    </div>
  )

}