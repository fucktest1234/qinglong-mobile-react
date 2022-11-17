import React,{useEffect, useState} from 'react'
import { Result,Badge, Card, Dialog, TextArea, Divider, List, FloatingPanel, Button, SearchBar } from 'antd-mobile'
import {getAction,putAction} from '../../utils/requests'
import {Alert} from '../../utils/utils'
import style from './index.module.less'
// code editor
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';




const anchors = [100, window.innerHeight * 0.4, window.innerHeight * 0.8]
type FloatingPanelRef = {
    setHeight: (
      height: number,
      options?: {
        immediate?: boolean // 是否跳过动画
      }
    ) => void
  }
export default class Fuck extends React.Component{
    state = {
        records:[],
        id:null,
        // editor
        editorValue:"//代码区域",
        filename:'',
        codeHeight:'600px',

        queryParams:{searchValue:''}
    }

    componentDidMount(){
        this.LoadData()  
    }

    LoadData = ()=>{
        getAction('/open/scripts/files',{
            ...this.state.queryParams
        }).then(res =>{
            console.log(res.data.data);
            this.setState({
                records: res.data.data.filter( item=> item.title.indexOf(this.state.queryParams.searchValue)>-1 ).filter( item=> item.title.indexOf('.swp') === -1 )
            })
        })
    }
    // 点击查看文件内容
    handleCardClick = title =>{
        console.log(title);
        getAction(`/open/scripts/${title}`,{
        }).then(res =>{
            console.log(res.data.data);
            this.setState({
                filename:title,
                editorValue:res.data.data
            })
        })
    }
    // 点击保存文件
    handleFileSaving = ()=>{
        console.log('进来否？');
        
        const {filename, editorValue} = this.state
        if(filename ===''){
            Alert('p文件都没有选，保存锤子')
            return
        }
        putAction('/open/scripts',{
            filename:filename,
            content:editorValue
        }).then(res=>{
            if(res.data.code ===200){
                Alert('保存正常')
            }
        })
    }




    render(){
       return (<div style={{margin:'0px auto'}}>

                <Button  color="primary" 
                            onClick={ ()=>
                                {
                                Dialog.show({
                                    title: '确认保存么？',
                                    closeOnAction: true,
                                    actions: [
                                      [
                                        {
                                          key: 'cancel',
                                          text: '取消',
                                        },
                                        {
                                          key: 'confirm',
                                          text: '确认',
                                          bold: true,
                                          danger: true,
                                          onClick:this.handleFileSaving
                                        },
                                      ],
                                    ],
                                  })
                                }
                            }
                        >
                            保存
                </Button>

                <Button  color="primary" 
                        onClick={()=>{
                            this.setState({
                                codeHeight:this.state.codeHeight == '600px'?'300px':'600px' 
                            })
                        }}
                        >
                            调整代码区域
                </Button>

                <div style={{minHeight:'600px'}}>
            <CodeMirror
                lazyLoadMode={false}
                value={this.state.editorValue}
                options={{
                    theme: 'monokai',
                    keyMap: 'sublime',
                    mode: 'js',
                }}
                onChange={ (editor, {text})=> {
                    this.setState({
                        editorValue:editor.getValue()
                    })
                }}
            />
        </div>

  
                <FloatingPanel anchors={anchors}>
                <SearchBar placeholder='请输入内容' showCancelButton onSearch={v=>this.setState({queryParams:{searchValue:v}},this.LoadData)} />
                    <List>
                    { this.state.records.map((v,index) => (
                            <List.Item key={index} onClick={()=>this.handleCardClick(v.title)}>
                                {v.title}
                            </List.Item>  
                    ))}
                    </List>
                </FloatingPanel>
        </div>)
    }
}
