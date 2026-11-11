/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { ChromePicker } from 'react-color'

const InputColor:React.FC<any> = ({name,onChange}) => {
    const [color,setColor] = React.useState("#000")
    const [colorPicker,setColorPicker] = React.useState(false)


    React.useEffect(() => {
        onChange(color)
    }, [color])

    return (
        <>
            <div className="flex items-center">
                <div 
                    onClick={() => setColorPicker(!colorPicker)}
                    style={{
                        background: color,
                    }}
                    className="flex items-center cursor-pointer w-8 h-8 gap-2 ">
                    
                </div>
                <div className="ml-2">
                        <span>{color}</span>
                </div>   
            </div>
            {
                colorPicker ? (
                    <div className="mt-2">
                        <ChromePicker  color={color} onChange={(cl:any) => setColor(cl.hex)}/>
                    </div>
                ) : null
            }
        </>
    );
}

export default InputColor;
