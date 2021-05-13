import Answer from "@/core/database/models/Answers"
import Propositions from "@/core/database/models/Propositions"
import Question from "@/core/database/models/Questions"
import Score from "@/core/database/models/Score"
import User from "@/core/database/models/Users"

export const Query = {
    questions: async () => await Question.find({ relations: ["goodAnswer"] }),
    answers: async () => await Answer.find(),
    users: async () => await User.find({ relations: ["score"] }),
    propositions: async () => await Propositions.find({ relations: ["proposition"] }),
    scores: async () => await Score.find({ relations: ["user"] })
}


