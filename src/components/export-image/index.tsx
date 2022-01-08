import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { Modal, Form, Input, Select, Button, notification } from 'antd';
import { FormInstance } from 'antd/es/form';
import { LoadingFullView } from '../loading';

type ExportImageProps = {
    onSave: (fileName: string, extension: '.jpg' | '.png' | '.svg') => Promise<void>
}

type FormSchema = {
    fileName: string
    extension: '.jpg' | '.png' | '.svg'
}

export const ExportImageModal = forwardRef(({onSave}: ExportImageProps, ref) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const formRef = useRef<FormInstance>(null);

    useImperativeHandle(ref, () => ({
        open: () => setVisible(true)
    }));

    const onExport = async (value: FormSchema) => {
        try {
            setLoading(true);
            await onSave(value.fileName, value.extension);
            onCloseModal();
        } catch (e) {
            notification.error({
                message: 'Save failed!'
            });
        } finally {
            setLoading(false);
        }
    };

    const onCloseModal = () => {
        setVisible(false);
    };


    const onGenderChange = (value: '.jpg' | '.png' | '.svg') => {
        formRef.current!.setFieldsValue({ extension: value });
    };

    return (
        <Modal title='Save Image' visible={visible}
            onCancel={onCloseModal}
            className='export-image-modal'
            footer={<div className='footer'>
                <Button shape='round' onClick={onCloseModal}>Cancel</Button>
                <Button type='primary' shape='round' onClick={() => formRef.current?.submit()}>Save</Button>
            </div>}
        >
            <Form className='export-form' ref={formRef} onFinish={onExport}>
                <Form.Item name='fileName' rules={[{ required: true }]} label='File name'>
                    <Input placeholder='File name'/>
                </Form.Item>
                <Form.Item name='extension' rules={[{ required: true }]} label='Extension' initialValue='.jpg'>
                    <Select
                        placeholder="File Extension"
                        allowClear
                        onChange={onGenderChange}
                    >
                        <Select.Option value=".jpg">.jpg</Select.Option>
                        <Select.Option value=".png">.png</Select.Option>
                        <Select.Option value=".svg">.svg</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
            {loading && <LoadingFullView />}
        </Modal>
    );
});