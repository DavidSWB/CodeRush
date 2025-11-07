export const quizQuestions = [
  // Preguntas Básicas
  {
    question: "¿Qué tipo de dato se usa para almacenar texto en Java?",
    options: ["String", "int", "boolean", "char"],
    correct: 0,
    level: "basic"
  },
  {
    question: "¿Qué tipo de dato se usa para números enteros en Java?",
    options: ["int", "String", "boolean", "double"],
    correct: 0,
    level: "basic"
  },
  {
    question: "¿Qué tipo de dato se usa para un solo carácter en Java?",
    options: ["char", "String", "int", "boolean"],
    correct: 0,
    level: "basic"
  },
  {
    question: "¿Qué método se usa para imprimir en la consola en Java?",
    options: ["System.out.println()", "print()", "console.log()", "write()"],
    correct: 0,
    level: "basic"
  },
  {
    question: "¿Qué tipo de dato se usa para valores decimales en Java?",
    options: ["double", "int", "String", "boolean"],
    correct: 0,
    level: "basic"
  },
  {
    question: "¿Qué tipo de dato se usa para verdadero/falso en Java?",
    options: ["boolean", "String", "int", "char"],
    correct: 0,
    level: "basic"
  },
  {
    question: "¿Qué símbolo se usa para terminar una instrucción en Java?",
    options: [";", ".", ",", ":"],
    correct: 0,
    level: "basic"
  },
  {
    question: "¿Cómo se declara una constante en Java?",
    options: ["final", "const", "var", "let"],
    correct: 0,
    level: "basic"
  },
  {
    question: "¿Cuál es la extensión de los archivos Java?",
    options: [".java", ".js", ".class", ".exe"],
    correct: 0,
    level: "basic"
  },
  {
    question: "¿Qué operador se usa para asignar valores en Java?",
    options: ["=", "==", "===", ":="],
    correct: 0,
    level: "basic"
  },
  // Preguntas Intermedias
  {
    question: "¿Qué es un array en Java?",
    options: ["Una colección de elementos del mismo tipo", "Un tipo de variable", "Un operador", "Un método"],
    correct: 0,
    level: "intermediate"
  },
  {
    question: "¿Qué es un método en Java?",
    options: ["Un bloque de código reutilizable", "Una variable", "Un operador", "Un tipo de dato"],
    correct: 0,
    level: "intermediate"
  },
  {
    question: "¿Qué es una clase en Java?",
    options: ["Una plantilla para crear objetos", "Un método", "Una variable", "Un operador"],
    correct: 0,
    level: "intermediate"
  },
  {
    question: "¿Qué es un objeto en Java?",
    options: ["Una instancia de una clase", "Un tipo de variable", "Un método", "Un operador"],
    correct: 0,
    level: "intermediate"
  },
  {
    question: "¿Qué es un constructor en Java?",
    options: ["Un método especial para crear objetos", "Una variable", "Un operador", "Un tipo de dato"],
    correct: 0,
    level: "intermediate"
  },
  {
    question: "¿Qué significa 'public' en Java?",
    options: ["Accesible desde cualquier clase", "Privado", "Protegido", "Final"],
    correct: 0,
    level: "intermediate"
  },
  {
    question: "¿Qué es la herencia en Java?",
    options: ["Una clase que hereda de otra", "Un método", "Una variable", "Un operador"],
    correct: 0,
    level: "intermediate"
  },
  {
    question: "¿Qué es un paquete en Java?",
    options: ["Un grupo de clases relacionadas", "Un método", "Una variable", "Un operador"],
    correct: 0,
    level: "intermediate"
  },
  {
    question: "¿Qué es un 'import' en Java?",
    options: ["Una manera de usar clases de otros paquetes", "Un método", "Una variable", "Un operador"],
    correct: 0,
    level: "intermediate"
  },
  {
    question: "¿Qué es un método 'void' en Java?",
    options: ["Un método que no retorna valor", "Un tipo de variable", "Un operador", "Una clase"],
    correct: 0,
    level: "intermediate"
  },
  // Preguntas Avanzadas
  {
    question: "¿Qué es una interfaz en Java?",
    options: ["Un contrato que define comportamiento", "Una clase", "Una variable", "Un operador"],
    correct: 0,
    level: "advanced"
  },
  {
    question: "¿Qué es una excepción en Java?",
    options: ["Un error durante la ejecución", "Un método", "Una variable", "Un operador"],
    correct: 0,
    level: "advanced"
  },
  {
    question: "¿Qué es un 'thread' en Java?",
    options: ["Un hilo de ejecución", "Una variable", "Un método", "Una clase"],
    correct: 0,
    level: "advanced"
  },
  {
    question: "¿Qué es la sobrecarga de métodos?",
    options: ["Múltiples métodos con el mismo nombre", "Un tipo de variable", "Un operador", "Una clase"],
    correct: 0,
    level: "advanced"
  },
  {
    question: "¿Qué es el polimorfismo en Java?",
    options: ["Múltiples formas de un método", "Un tipo de variable", "Un operador", "Una clase"],
    correct: 0,
    level: "advanced"
  },
  {
    question: "¿Qué es una clase abstracta?",
    options: ["Una clase que no se puede instanciar", "Un método", "Una variable", "Un operador"],
    correct: 0,
    level: "advanced"
  },
  {
    question: "¿Qué es el encapsulamiento?",
    options: ["Ocultar los detalles de implementación", "Un método", "Una variable", "Un operador"],
    correct: 0,
    level: "advanced"
  },
  {
    question: "¿Qué es un método estático?",
    options: ["Un método que pertenece a la clase", "Una variable", "Un operador", "Una interfaz"],
    correct: 0,
    level: "advanced"
  },
  {
    question: "¿Qué es la recursividad?",
    options: ["Un método que se llama a sí mismo", "Un tipo de variable", "Un operador", "Una clase"],
    correct: 0,
    level: "advanced"
  },
  {
    question: "¿Qué es el Garbage Collector?",
    options: ["Sistema de gestión de memoria", "Un método", "Una variable", "Un operador"],
    correct: 0,
    level: "advanced"
  }
];

// Función auxiliar para obtener una pregunta aleatoria según el nivel
export const getRandomQuestion = (level) => {
  const questionsForLevel = quizQuestions.filter(q => q.level === level);
  const randomIndex = Math.floor(Math.random() * questionsForLevel.length);
  return questionsForLevel[randomIndex];
};