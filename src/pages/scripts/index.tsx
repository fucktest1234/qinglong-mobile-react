import React, { useEffect, useState, useRef } from 'react'
import { Result, Badge, Card, Dialog, TextArea, Button, Form, Input, SearchBar } from 'antd-mobile'
import { getAction, putAction, postAction } from '../../utils/requests'
import { Toast, Alert } from '../../utils/utils'
import style from './index.module.less'
import cronParse from 'cron-parser';


export default class Fuck extends React.Component {
    state = {
        records: [],
        id: null,

        queryParams: {
            searchValue: ''
        },
    }

    componentDidMount() {
        this.LoadData()
    }

    /* 列出数据 */
    LoadData = () => {
        getAction('/open/crons', {
            ...this.state.queryParams
        }).then(res => {
            console.log(res.data.data);
            this.setState({
                records: res.data.data.sort((x, y) => x.status - y.status + x.isDisabled - y.isDisabled)
            })
        })
    }
    /*
        查看日志
    */
    handleCardClick = (v) => {
        console.log(v);
        getAction(`/open/crons/${v.id}/log`, {}).then(res => {
            console.log(res.data.data);
            // 显示日志内容
            Dialog.show({
                closeOnMaskClick: true,
                title: v.name,
                content: (
                    <TextArea
                        style={{ '--font-size': '12px' }}
                        defaultValue={res.data.data}
                        autoSize={{ minRows: 3 }}
                    />
                )
            })
        })
    }

    // 运行任务
    runTask = (id, status) => {
        const action = status == 0 ? 'stop' : 'run' // 0表示运行中，点击则停止， 
        putAction(`/open/crons/${action}`, [id]).then(res => {
            console.log(res.data);
            if (res.data.code == 200) {
                this.LoadData()
            }
        })
    }

    // 添加任务
    addSchedule = () => {
        Dialog.show({
            closeOnAction: true,
            closeOnMaskClick: true,
            content: (
                <Form style={{ width: '96%', height: '90%' }}
                    onFinish={this.onFormFinish}
                    footer={
                        <Button block type='submit' color='primary'>
                            添加
                        </Button>
                    }
                >
                    <Form.Item
                        name='name'
                        label='名称'
                        rules={[{ required: true, message: '名称不能为空' }]}
                    >
                        <Input placeholder='请输入名称' />
                    </Form.Item>

                    <Form.Item name='command' label='命令'
                        rules={[{ required: true, message: '命令不能为空' }]}>
                        <Input placeholder='请输入命令' />
                    </Form.Item>

                    <Form.Item name='schedule' label='定时规则'
                        rules={[{
                            required: true, message: '规则不能为空',
                            validator: (rule, value, callback) => {
                                if (cronParse.parseExpression(value).hasNext()) {
                                    // return Promise.resolve();
                                    callback()
                                } else {
                                    // return Promise.reject('Cron表达式格式有误');
                                    callback('crob表达式有误')
                                }
                            },
                        }]}
                    >
                        <Input placeholder='秒(可选) 分 时 天 月 周' />
                    </Form.Item>
                </Form>
            ),
        })
    }

    // 完成表单
    onFormFinish = (values: any) => {
        postAction('/open/crons', values).then(res => {
            if (res.data.code == 200) {
                Alert('添加成功')
            }
        })
    }




    render() {
        const status = (text) => {
            const status = {
                0: <Badge content="已启用" color="#2ce654"/>,
                1: <Badge content="已禁用" color='#ec1010'/>
            }
            return status[text]
        }

        return (<div style={{ margin: '0px auto', width: '90%', marginBottom: '5vh' }}>
            <div style={{ display: 'flex', margin: '10px 0', justifyContent:'space-between' }}>
                <Button style={{width:'6em',marginRight:'10px'}} color="primary" size="mini" onClick={this.addSchedule}>添加任务</Button>
                <SearchBar style={{ '--background': '#ffffff', flex:1 }} placeholder='请输入内容' showCancelButton onSearch={v => this.setState({ queryParams: { searchValue: v } }, this.LoadData)} />
            </div>
            {this.state.records.map((v, index) => (
                <div key={index} className={style.card}>
                    <Card onClick={() => this.handleCardClick({ id: v._id, name: v.name })} title={v.name} extra={<div style={{ marginLeft: 10 }}> {status(v.isDisabled)}</div>}>
                        <p>{v.schedule}</p>
                        <p className={style.status}>{v.status == 0 ? '运行中' : '空闲'}</p>
                    </Card>
                    <Button className={style.runbtn} color={v.status == 0 ? "danger" : "primary"}
                        onClick={() => {
                            Dialog.show({
                                title: '确认运行么？',
                                closeOnAction: true,
                                actions: [
                                    [
                                        {
                                            key: 'cancel',
                                            text: '取消',
                                        },
                                        {
                                            key: 'delete',
                                            text: '确认',
                                            bold: true,
                                            danger: true,
                                            onClick: () => this.runTask(v._id, v.status)
                                        },
                                    ],
                                ],
                            })
                        }
                        }
                    >
                        {v.status == 0 ? "停止" : "运行"}
                    </Button>
                </div>
            ))}
        </div>)
    }
}
