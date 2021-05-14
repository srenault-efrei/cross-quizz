import React, { useEffect, useState } from 'react'
import {
    SafeAreaView,
    View,
    Text,
    Button
} from 'react-native';

import styles from '../../assets/styles/global'
import { gql, useQuery } from '@apollo/client';
import MyHeader from './header';

const QUESTIONS = gql`
  query Questions {
    questions {
      id
      value
      goodAnswer{
          id
          value
      }
    }
  }
`;

const PROPOSITIONS = gql`
  query Propositions {
    propositions {
      id
      step
      proposition{
        id
        value
      }
    }
  }
`;

const quizz = (props) => {

    const dataQuestions = useQuery(QUESTIONS);
    const dataPropositions = useQuery(PROPOSITIONS);
    const [score, setScore] = useState(0)

    const propositions = dataPropositions?.data?.propositions


    const renderView = (props) => {
        return (
            <>
                <Text style={{ textAlign: "center", fontSize: 30, marginBottom: 20 }}>
                    {/* {console.log(dataQuestions.data.questions[1].value)} */}
                    {dataQuestions.data && dataQuestions.data.questions[1].value}
                </Text>

                <View style={{
                    backgroundColor: "#16B83C", width: "60%", alignItems: "center", borderWidth: 1, borderColor: "white", justifyContent: "center",
                    borderRadius: 15, padding: 10
                }}>

                    <View style={{
                        backgroundColor: "white", width: "90%", borderWidth: 1, borderColor: "white",
                        borderRadius: 5, borderRadius: 5, marginBottom: 10
                    }}>

                        < Text style={{ textAlign: "center", fontSize: 20 }} onPress={() => props.navigation.navigate('End', { score })
                        }> {propositions && propositions[0].proposition.value}</Text>
                    </View>
                    <View style={{
                        backgroundColor: "white", width: "90%", borderWidth: 1, borderColor: "white", marginBottom: 10,
                    }}>

                        < Text style={{ textAlign: "center", fontSize: 20 }}
                            onPress={() => {
                                props.navigation.navigate('End', { score: 1 })
                            }}
                        > {propositions && propositions[1].proposition.value}
                        </Text>
                    </View>
                    <View style={{
                        backgroundColor: "white", width: "90%", borderWidth: 1, borderColor: "white", marginBottom: 10
                    }}>

                        < Text style={{ textAlign: "center", fontSize: 20 }} onPress={() => props.navigation.navigate('End', { score })
                        }> {propositions && propositions[4].proposition.value}</Text>
                    </View>
                    <View style={{
                        backgroundColor: "white", width: "90%", borderWidth: 1, borderColor: "white", marginBottom: 10
                    }}>

                        < Text style={{ textAlign: "center", fontSize: 20 }} onPress={() => props.navigation.navigate('End', { score })
                        }> {propositions && propositions[5].proposition.value}</Text>
                    </View>
                </View>
            </>
        )
    }
    return (
        <SafeAreaView style={styles.safeArea}>
            <MyHeader name="Dashboard" navigation={props.navigation}>
            </MyHeader>
            <View style={{ flex: 2, alignItems: "center", justifyContent: "center" }} >
                {

                    renderView(props)

                }

            </View>

        </SafeAreaView >

    );

}


export default quizz