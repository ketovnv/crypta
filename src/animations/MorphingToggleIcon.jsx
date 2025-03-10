import React, { useState } from 'react';
import { motion } from 'framer-motion';
function MorphingToggleIcon() {
    const [isActive, setIsActive] = useState(false);
// Пути для двух состояний иконки
    const hamburgerPath = "M 20 35 L 80 35 M 20 50 L 80 50 M 20 65 L 80 65";
    const closePath = "M 30 30 L 70 70 M 30 70 L 70 30";
    return (
        <div style="{{" padding:="" '2rem',="" background:="" '#f8f9fa',="" borderradius:="" '8px',="" textalign:="" 'center'="" }}="">
    <div style="{{" display:="" 'inline-block',="" background:="" isactive="" ?="" '#339af0'="" :="" '#f8f9fa',="" width:="" '100px',="" height:="" borderradius:="" '50%',="" boxshadow:=""
'0="" 4px="" 6px="" rgba(0,="" 0,="" 0.1)',="" cursor:="" 'pointer',="" transition:="" 'background="" 0.3s="" ease'="" }}="" onclick="{()" ==""> setIsActive(!isActive)}
&gt;
<svg width="100" height="100" viewBox="0 0 100 100">
    <motion.path d="{isActive" ?="" closepath="" :="" hamburgerpath}="" stroke="{isActive" 'white'="" '#495057'}="" strokewidth="5" strokelinecap="round" fill="transparent" initial="
{false}" animate="{{" d:="" isactive="" hamburgerpath="" }}="" transition="{{" type:="" "spring",="" stiffness:="" 260,="" damping:="" 20=""></motion.path>
</svg>
</div>
    <div style="{{" margintop:="" '1rem',="" color:="" '#495057'="" }}="">
    {isActive ? "Нажмите, чтобы открыть меню" : "Нажмите, чтобы закрыть меню"}
</div>
</div>
);
}