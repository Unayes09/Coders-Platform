import React, { useContext, useEffect, useState } from 'react';
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../providers/UserProvider";
import { isPremiumUser } from "../../utils/dateCalculation";
import { FaLightbulb } from 'react-icons/fa';
import { GiTrophy } from 'react-icons/gi';

const GapAnalysis = () => {
  const { user, isUserLoading } = useContext(UserContext);
  const [analysisText, setAnalysisText] = useState('');
  const [error, setError] = useState(null);
  let isError = false;

  useEffect(() => {
    const fetchData = async () => {
      // Check if user is logged in
      if (!user && !isUserLoading) {
        isError = true;
        setError('Please login to see the content of this page.');
        return;
      }

      // Check if user is premium
      const isPremium = isPremiumUser(user?.premiumPackBuyDate, 90);
      console.log(isPremium)
      if (!isPremium) {
        isError = true;
        //console.log("asche")
        setError('You should be a premium member to see the content of this page.');
        return;
      }

      try {
        // Call the first API to get arrays
        const response = await axiosInstance.get('/api/skill/data', {
          params: { email: user.email }
        });
        //console.log(response.data)
        //const { array1, array2 } = response.data;
        const array1 = response.data.interestAndSkills
        const array2 = response.data.repoAndCerts
        // console.log(array1)
        // console.log(array2)

        // Combine arrays into a string prompt
        const prompt = `The topics in which user wants to get expertised or wants to know are ${array1.join(", ")} and the topics in which users already works are ${array2.join(", ")}. Now analysis those and make an instruction list of what to do for user like what user should learn now and how user can reach at their dream.`;
        console.log(prompt)
        // Call the second API with the prompt
        // const aiResponse = await axiosInstance.post('/prompt', { prompt: prompt,geminiKey: import.meta.env.VITE_GEMINI_API_KEY });
        // const text = aiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        // Set the AI-generated text in the state
        const text='Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo vel animi magni ipsum, ratione voluptate maxime totam, quos fuga placeat unde quisquam soluta sed sequi. Doloribus tempore, ut sint iure praesentium sunt sed amet nostrum quibusdam. Nulla aliquam laboriosam atque id, doloribus dolorem iusto tempore libero, temporibus nam magni! Dolore temporibus ut vero laboriosam veniam tenetur quod ex, placeat fugiat? Vitae, sequi rem doloribus corporis mollitia quam debitis deleniti, ullam, assumenda accusamus vero! Quis dolorum cumque sit sunt voluptates animi doloribus harum officia. Voluptas nam consequuntur tenetur quas beatae impedit, iusto vitae quo voluptates? Reiciendis corporis unde ab veritatis fugiat tempore inventore dicta tenetur. Alias corrupti ea corporis. Amet, reprehenderit dolores! Commodi, fugiat non! Dicta quidem tenetur voluptatibus in cumque nam atque maiores, nihil assumenda beatae perspiciatis consequuntur consectetur tempora qui neque non maxime praesentium repellat doloremque. Deserunt fugit cum non fugiat saepe eius in ab impedit! Suscipit, accusamus maiores facilis animi sapiente cumque eligendi, dolore repellat similique et expedita tempore beatae libero nulla, ipsam harum ducimus a fugiat quibusdam quidem voluptas necessitatibus nobis exercitationem. Ab excepturi illo dicta minima sunt provident ullam quis nemo esse velit saepe tempora, iste numquam eveniet quisquam suscipit neque unde dolor harum odit dolorum? Voluptate odio corporis neque sequi expedita molestias accusantium impedit eos aspernatur. Debitis aliquam fugiat quia quaerat enim sint non explicabo, obcaecati eligendi earum quo quae soluta nobis a eos sed maiores aut! Delectus quas, fugiat inventore saepe quo veniam tempora velit autem enim accusantium doloremque ratione quos aliquid alias animi aperiam explicabo eligendi sed natus. Excepturi ea, ipsum mollitia magnam sed quia voluptatum nostrum minima voluptates et alias tenetur voluptas. Vero nostrum nihil quis minus aut aliquam eligendi quia repudiandae! Natus iusto, quam hic tempore eius debitis iure delectus est? Aut pariatur vel harum fugiat accusantium. Sunt natus suscipit rerum magni eaque. Sequi, officia repellat ipsa deserunt rem saepe eaque iusto maiores suscipit repellendus iste deleniti aliquid in non debitis commodi dicta libero minima reiciendis necessitatibus a omnis. Dolore nihil dolorem amet temporibus cupiditate accusantium commodi a aliquam error? Ipsum sit inventore id est quia autem itaque voluptatem assumenda reiciendis libero exercitationem quae ratione ut suscipit nostrum, eius similique dolore facilis repellat. Recusandae perspiciatis aperiam consectetur et, molestias facere vero exercitationem. Fugiat quis odit obcaecati quas maiores ipsum possimus quasi reiciendis dolores consequuntur officia non dicta corrupti iusto blanditiis assumenda fugit vero, vel cumque. Non quidem aliquid laudantium unde numquam.'
        setAnalysisText(text);
        //setError(prompt);
      } catch (err) {
        setError('Error fetching skill gap analysis. Please try again later.');
      }
    };

    fetchData();
  }, [user, isUserLoading]);

  return (
    <div className="flex justify-center ">
      {isUserLoading ? (
        <div className="text-white text-lg">Loading...</div>
      ) : isError ? (
        <div className="text-red-500 text-lg">{error}</div>
      ) : (
        <div className=" bg-gray-300 shadow-lg rounded-lg p-6 m-20 w-full">
            <div className='flex'>
                <GiTrophy className='text-3xl text-red-800'/>
                <GiTrophy className='text-3xl text-yellow-600'/>
                <GiTrophy className='text-3xl text-purple-600'/>
            </div>
            
          <h2 className="text-3xl font-bold text-black mb-4">Skill Gap Analysis</h2>
          <div className="border border-white p-4 rounded-lg relative">
            <FaLightbulb className=" text-yellow-400 absolute top-2 right-2 text-2xl"/>
            <p className="text-gray-900">{analysisText}</p> {/* AI-generated text displayed */}
          </div>
        </div>
      )}
    </div>
  );
};

export default GapAnalysis;
