import {ScrollArea} from '@mantine/core';
// import AnimatedNumber from "@animations/AnimatedNumber";
// import AnimatedText from "@animations/textures/AnimatedText.tsx";
// import AnimatedTextures from "@animations/textures/AnimatedTextures";
// import DarkStaticTextures from "@animations/textures/DarkStaticTextures";
// import NoiseTextures from "@animations/textures/NoiseTextures";
// import StaticTextures from "@animations/textures/StaticTextures";
// import TextureEffects from "@animations/textures/TextureEffects";
// import AnimatedTexturesOne from "@animations/textures/AnimatedTexturesOne";
// import {FontTest} from "@components/Pages/Options/FontTest.jsx";



const Options = () => {
    return (
            <ScrollArea h="calc(100vh - var(--app-shell-header-height, 0px) - 150px)">
                <FontTest/>
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