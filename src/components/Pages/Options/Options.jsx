import {ScrollArea} from '@mantine/core';
// import AnimatedNumber from "@components/Animations/AnimatedNumber";
import AnimatedText from "@components/Animations/Textures/AnimatedText";
import AnimatedTextures from "@components/Animations/Textures/AnimatedTextures";
import DarkStaticTextures from "@components/Animations/Textures/DarkStaticTextures";
import NoiseTextures from "@components/Animations/Textures/NoiseTextures";
import StaticTextures from "@components/Animations/Textures/StaticTextures";
import TextureEffects from "@components/Animations/Textures/TextureEffects";
import AnimatedTexturesOne from "@components/Animations/Textures/AnimatedTexturesOne";



const Options = () => {
    return (
            <ScrollArea h="calc(100vh - var(--app-shell-header-height, 0px) - 150px)">
                <AnimatedText/>
                <AnimatedTextures/>
                <AnimatedTexturesOne/>
                <DarkStaticTextures/>
                <NoiseTextures/>
                <StaticTextures/>
                <TextureEffects/>
            </ScrollArea>
    );
};

export default Options;