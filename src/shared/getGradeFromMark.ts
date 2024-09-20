type iResult = {
    grade:string,
    point:number
}

const getGradeFromMark = (marks:number):iResult => {
    const result:iResult = {grade:'',point:0}
    if(marks >= 0 && marks <= 39){
      result.grade = 'F'
      result.point = 0
    }else if(marks >= 40 && marks <=50){
      result.grade = "D"
      result.point=2.30
    }else if(marks >= 51 && marks <=60){
      result.grade = "C"
      result.point=2.80
    }else if(marks >= 61 && marks <=70){
      result.grade = "B"
      result.point=3.00
    }else if(marks >= 71 && marks <=80){
      result.grade = "A"
      result.point=3.50
    }else if(marks >= 81 && marks <=100){
      result.grade = "A+"
      result.point=4.00
    }
    return result
}

export default getGradeFromMark