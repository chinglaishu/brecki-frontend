
import React,{ useState} from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Animated, Dimensions, ActivityIndicator, } from "react-native";
import LottieView from 'lottie-react-native';

export default function Progressbar(){
    const [index, setIndex] =useState(0);
    const [current, setCurrent] = useState(new Animated.Value(0));
    const [progress, setProgress] = useState(new Animated.Value(0));
    const [running, setRunning] = useState(1);
    const questions=[
        "Do you love React Native?",
        "Do you want to be good at this?",
        "Do you follow me to learn React Native?",
        "Are you a beginner?",
        "Follow me",
    ];
    let nextQuesiton = "";
    const quesiton = questions[index];
    if(index<questions.length){
        nextQuesiton=questions[index+1];
    }

    const handlePress=()=>{
            Animated.parallel([
                Animated.timing(current, {
                    toValue:1,
                    duration:400,
                    useNativeDriver:false,
                }),
                Animated.timing(progress, {
                    toValue:index+1,
                    duration:400,
                    useNativeDriver:false
                })
            ]).start(()=>{
                setIndex(index+1);
                current.setValue(0);

                if(index+1>=5){
                    setTimeout(()=>{
                        setRunning(0)
                    }, 500)
                }

            })
    }
    const {width} = Dimensions.get("window");
    const currentAnim=current.interpolate({
        inputRange:[0, 1],
        outputRange:[0, -width]
    });

    const nextAnim=current.interpolate({
        inputRange:[0, 1],
        outputRange:[width, 0]
    });

    const progressAnim = progress.interpolate({
        inputRange:[0, questions.length],
        outputRange:["20%", "100%"],
    });

    const barWidth={
        width:progressAnim
    }

    const translate={
        transform:[
            {translateX:currentAnim}
        ]
    }
    const translateNext={
        transform:[
            {translateX:nextAnim}
        ]
    }


    const renderElement=()=>{
  
            if(running==1){

                return(
                    <View style={styles.mainView}>
                        <Animated.View style={[styles.bar, barWidth]}>
    
                        </Animated.View>
                        <Animated.Text style={[styles.questions, translateNext]}>
                            {nextQuesiton}
                        </Animated.Text>
                        <Animated.Text style={[styles.questions, translate]}>
                            {quesiton}
                        </Animated.Text>
        
                        <TouchableOpacity style={styles.yesBtn} onPress={handlePress}>
                            <Text style={styles.yes}>
                                Yes
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.noBtn} onPress={handlePress}>
                            <Text style={styles.no}>
                                Yes
                            </Text>
                        </TouchableOpacity>
                    </View>
                )
            }else{
                return(
                    <View style={styles.mainView}>

                    </View>
                )
            }
        

    }

return(
    renderElement()
)
}

const styles= StyleSheet.create({
    mainView:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    bar:{
        backgroundColor:"#fc5c56",
        height:100,
        borderRadius:50,
        position:"absolute",
        top:100,
        //left:-50,
    },
    questions:{
        position:"absolute",
        fontSize:20,
        backgroundColor:"transparent",
        color: "gray"

    },
    yes:{
        color:"white",
        fontFamily:"Avenir",
        fontSize:22,
        fontWeight:"600",
    },
    no:{
        color:"white",
        fontFamily:"Avenir",
        fontSize:22,
        fontWeight:"600",
    },
    yesBtn:{
        width:100,
        height:100,
        borderRadius:50,
        backgroundColor:"red",
        position:"absolute",
        bottom:200,
        left:50,
        justifyContent:"center",
        alignItems:"center"
    },
    noBtn:{
        width:100,
        height:100,
        borderRadius:50,
        backgroundColor:"#fc6c65",
        position:"absolute",
        bottom:200,
        right:50,
        justifyContent:"center",
        alignItems:"center",

    }
})
 