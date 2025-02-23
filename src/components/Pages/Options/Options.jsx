import {ScrollArea} from '@mantine/core';
// import AnimatedNumber from "@components/Animations/AnimatedNumber";
import AnimatedText from "@components/Textures/AnimatedText";
import AnimatedTextures from "@components/Textures/AnimatedTextures";
import DarkStaticTextures from "@components/Textures/DarkStaticTextures";
import NoiseTextures from "@components/Textures/NoiseTextures";
import StaticTextures from "@components/Textures/StaticTextures";
import TextureEffects from "@components/Textures/TextureEffects";
import AnimatedTexturesOne from "@components/Textures/AnimatedTexturesOne";



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