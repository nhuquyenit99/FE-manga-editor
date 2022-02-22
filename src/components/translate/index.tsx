import React, { forwardRef, useContext, useImperativeHandle, useState } from 'react';
import { Button, Modal, notification, Select } from 'antd';
import { ImageContext } from '../../context';
import { defaultTextBoxStyle, TextBoxData, TranslateResponse } from '../../model';
import { DataAccess } from '../../access';
import { LoadingFullView } from '../loading';
import { LanguageObj } from './language';
import './style.scss';

type TranslateModel = {
    url: string,
    page: number,
    file_name: string,
}

export type TranslateModelRef = {
    open: (data: TranslateModel) => void
}

export const TranslateModal = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [language, setLanguage] = useState('en');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<TranslateModel>();

    const { setTextBoxs } = useContext(ImageContext);

    useImperativeHandle(ref, () => ({
        open: (data: TranslateModel) => {
            setVisible(true);
            setData(data);
        }
    }));

    const onCloseModal = () => {
        setVisible(false);
        setLanguage('en');
        setData(undefined);
    };

    const translate = async () => {
        if (!data) {
            return;
        }
        try {
            setLoading(true);
            const res = await DataAccess.translate({
                ...data,
                lang: language
            });
            const listTextBoxs = res?.data as TranslateResponse;
            if (listTextBoxs) {
                const processedTextBoxs = {} as Record<string, TextBoxData>;
                listTextBoxs.forEach(item => {
                    processedTextBoxs[item.id] = {
                        coordinates: {
                            x: item.poly.x1 < item.poly.x2 ? item.poly.x1 : item.poly.x2,
                            y: item.poly.y1 < item.poly.y2 ? item.poly.y1 : item.poly.y2,
                            width: Math.abs(item.poly.x1 - item.poly.x2),
                            height: Math.abs(item.poly.y1 - item.poly.y2)
                        },
                        id: item.id,
                        page: item.page,
                        style: {
                            ...defaultTextBoxStyle,
                            fontSize: '12px',
                        },
                        text: item.translated_text,
                        tooltip: item.original_text
                    };
                });
                setTextBoxs(processedTextBoxs);
            }
            onCloseModal();
            notification.success({
                message: 'Translate successfully'
            });
        } catch (e) {
            notification.error({
                message: 'Translate Failed',
                description: 'Please try again'

            });
        } finally {
            setLoading(false);
        }

    };
    
    return (
        <Modal title='Auto-Translate'
            width={450}
            visible={visible}
            onCancel={onCloseModal}
            className='translate-modal'
            footer={<div className='footer'>
                <Button shape='round' onClick={onCloseModal}>Cancel</Button>
                <Button type='primary' shape='round' onClick={translate}>Submit</Button>
            </div>}
        >
            {loading && <LoadingFullView />}
            <div className='text-label'>
                What language do you want to translate texts into?
            </div>
            <Select
                value={language}
                onChange={(value) => setLanguage(value)}
                showSearch
                filterOption={(input, option) => {
                    return (option?.value as string)?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    || (option?.label as string)?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
            >
                {Object.entries(LanguageObj.translation).map(([key, value]) => {
                    return <Select.Option value={key} label={value.name}>
                        <div>
                            <b className='language-key'>{key}</b>
                            {value.name}
                        </div>
                    </Select.Option>;
                })}
            </Select>
        </Modal>
    );
});