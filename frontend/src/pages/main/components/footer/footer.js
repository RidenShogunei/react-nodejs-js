import React from "react";
import style from './footer.module.css'
const footer = () => {
    const ICP = '沪ICP备202405831号';
    return (
        <>
            <div className={style.footer}>
                <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">
                    { ICP }</a>
            </div>
        </>
    )
}
export default footer;