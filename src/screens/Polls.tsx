import { Octicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FlatList, Icon, useToast, VStack } from "native-base";
import { useCallback, useState } from "react";
import { Button } from "../components/Button";
import { EmptyPollList } from "../components/EmptyPollList";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PollCard, PollCardProps } from "../components/PollCard";
import { api } from "../services/api";

export function Polls() {
  const [isLoading, setIsLoading] = useState(true);
  const [polls, setPolls] = useState<PollCardProps[]>([]);
  const { navigate } = useNavigation();
  const toast = useToast();

  async function fetchPolls() {
    try {
      setIsLoading(true)
      const response = await api.get('/polls')
      setPolls(response.data.polls)
    } catch (error) {
      console.log(error)
      toast.show({
        title: 'Não foi possível carregar os bolões!',
        placement: 'top',
        bgColor: 'red.500'
      });
    }finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchPolls()
  },[]))

  return(
    <VStack flex={1} bgColor="gray.900" >
       <Header title="Meus bolões" />

      <VStack mt={6} mb={4} mx={5} borderBottomWidth={2} borderBottomColor="gray.600" pb={4}   >
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
          onPress={() => navigate('find')}
        />
      </VStack>
      {
        isLoading ? <Loading /> :
        <FlatList
          data={polls}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PollCard 
              data={item} 
              onPress={() => navigate('details', { id: item.id })}
            />
          )} 
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => <EmptyPollList />}
          _contentContainerStyle={{ pb: 10 }}
          px={5}
        />
      }
      
    </VStack>
  )
}