import React, { useEffect, useState, useRef } from 'react'
import { Dialog, TextArea, Divider, List, FloatingPanel, Button, SearchBar } from 'antd-mobile'
import { getAction, postAction } from '../../utils/requests'
import { Alert } from '../../utils/utils'
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


// let editorValue = '//代码区域'
export default () => {
    const codeRef = useRef()
    const [editorValue, setEditorValue] = useState('// 1111')

    const [queryParams, setQueryParams] = useState({})
    const [filename, setFilename] = useState('')
    const [codeHeight, setCodeHeight] = useState('600px')
    // 初始化
    useEffect(() => {
        LoadData()
    }, [])

    useEffect(() => {
        LoadData()
    }, [JSON.stringify(queryParams)])

    const LoadData = () => {
        getAction('/open/configs/config.sh', {
        }).then(res => {
            setEditorValue(res.data.data)
        })
    }
    // 点击查看文件内容
    const handleCardClick = title => {
        console.log(title);
        getAction(`/open/scripts/${title}`, {
        }).then(res => {
            console.log(res.data.data);
            setFilename(title)
            setEditorValue(res.data.data)
        })
    }
    // 点击保存文件
    const handleFileSaving = () => {
        console.log('进来否？');
        let savefile = 'config.sh'
        // 只操作了一个config.sh
        postAction('/open/configs/save', {
            name: savefile,
            content: editorValue
        }).then(res => {
            if (res.data.code === 200) {
                Alert('保存正常')
            }
        })
    }

    return (<div style={{ margin: '0px auto',background:'rgb(39,40,34)' }}>

        <Button color="primary"
        size='small'
            onClick={() => {
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
                                onClick: handleFileSaving
                            },
                        ],
                    ],
                })
            }
            }
        >
            保存
        </Button>

        {/* <Button color="primary"
            onClick={() => {
                setCodeHeight(codeHeight == '600px' ? '300px' : '600px')
            }}
        >
            调整编辑区域高度
        </Button> */}

        <div style={{minHeight:'600px'}}>
            <CodeMirror
                ref={codeRef}
                lazyLoadMode={false}
                value={editorValue}
                options={{
                    theme: 'monokai',
                    keyMap: 'sublime',
                    mode: 'js',
                }}
                onChange={ (editor, {text})=> {
                   setEditorValue(editor.getValue() )
                }}
            />
        </div>
    </div>)
}
