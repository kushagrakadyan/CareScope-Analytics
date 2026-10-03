class PredictionService {

    /*
    ============================================
        Disease Prediction (Dummy Logic)
    ============================================
    */

    async predictDisease(symptoms) {

        const text = symptoms.toLowerCase();

        if (
            text.includes("fever") &&
            text.includes("cough")
        ) {

            return {

                disease: "Flu",

                confidence: "90%"

            };

        }

        if (
            text.includes("chest") &&
            text.includes("pain")
        ) {

            return {

                disease: "Heart Disease",

                confidence: "87%"

            };

        }

        if (
            text.includes("headache")
        ) {

            return {

                disease: "Migraine",

                confidence: "81%"

            };

        }

        if (
            text.includes("diabetes")
        ) {

            return {

                disease: "Diabetes",

                confidence: "85%"

            };

        }

        return {

            disease: "Unknown",

            confidence: "0%"

        };

    }


    /*
    ============================================
        Risk Level
    ============================================
    */

    async getRiskLevel(age) {

        if (age < 18) {

            return "Low";

        }

        if (age < 45) {

            return "Medium";

        }

        if (age < 60) {

            return "High";

        }

        return "Very High";

    }


    /*
    ============================================
        Health Score
    ============================================
    */

    async calculateHealthScore(patient) {

        let score = 100;

        if (patient.age > 50)
            score -= 20;

        if (patient.smoker)
            score -= 25;

        if (patient.diabetic)
            score -= 15;

        if (patient.bpPatient)
            score -= 10;

        if (score < 0)
            score = 0;

        return score;

    }

}

module.exports = new PredictionService();