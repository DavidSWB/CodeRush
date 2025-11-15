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

// Additional questions (~+50% increase to bank)
quizQuestions.push(
  {
    question: "¿Cuál es la diferencia entre '==' y '.equals()' en Java?",
    options: ["'==' compara referencias; .equals() compara contenido", "Son exactamente iguales", "'==' compara contenido; .equals() compara referencias", "Ambos comparan referencias"],
    correct: 0,
    level: "intermediate"
  },
  {
    question: "¿Las cadenas (String) en Java son mutables o inmutables?",
    options: ["Inmutables", "Mutables", "Depende de la JVM", "Solo cuando se usan literales"],
    correct: 0,
    level: "basic"
  },
  {
    question: "¿Cuál es la sintaxis correcta para declarar una lista genérica de Strings?",
    options: ["List<String> lista = new ArrayList<>();", "List lista = new ArrayList<String>();", "ArrayList<> lista = new List<String>();", "List<String> lista = new List<String>();"],
    correct: 0,
    level: "intermediate"
  },
  {
    question: "¿Qué hace 'finally' en un bloque try/catch/finally?",
    options: ["Se ejecuta siempre después del try/catch, incluso si hay return", "Solo se ejecuta si hay una excepción", "Solo cuando no hay excepciones", "Nunca se ejecuta si se hace return"],
    correct: 0,
    level: "intermediate"
  },
  {
    question: "¿Cómo se añade un elemento a un ArrayList 'al' de tipo String?",
    options: ["al.add(\"texto\");", "al.push(\"texto\");", "al.put(\"texto\");", "al.insert(\"texto\");"],
    correct: 0,
    level: "basic"
  },
  {
    question: "¿Qué interfaz se usa para iterar con 'for-each' (enhanced for) sobre una colección?",
    options: ["Iterable", "Iterator", "Collection", "ListIterator"],
    correct: 0,
    level: "intermediate"
  },
  {
    question: "¿Qué devuelve HashMap.get(key) si la clave no existe?",
    options: ["null", "0", "false", "Lanza una excepción"],
    correct: 0,
    level: "intermediate"
  },
  {
    question: "¿Qué palabra clave identifica un método que pertenece a la clase y no a instancias?",
    options: ["static", "final", "this", "instance"],
    correct: 0,
    level: "basic"
  },
  {
    question: "¿Qué colección permite claves únicas y busca en promedio en tiempo O(1)?",
    options: ["HashMap", "TreeMap", "ArrayList", "LinkedList"],
    correct: 0,
    level: "advanced"
  },
  {
    question: "¿Cuál es la forma correcta de declarar un método genérico que devuelve T?",
    options: ["public <T> T metodo(T t)", "public T metodo<T>(T t)", "public T<T> metodo(T t)", "public <T> metodo(T t) T"],
    correct: 0,
    level: "advanced"
  },
  {
    question: "¿Qué sucede si se lanza una excepción en un bloque try y hay un return dentro del try?",
    options: ["Finalmente se ejecuta y el return se procesa, a menos que la excepción no sea capturada", "El return se ignora", "El programa termina sin ejecutar finally", "El return se ejecuta antes del catch"],
    correct: 0,
    level: "advanced"
  },
  {
    question: "¿Qué clase envuelve a un int primitivo como objeto?",
    options: ["Integer", "IntObject", "IntWrapper", "NumberInt"],
    correct: 0,
    level: "basic"
  },
  {
    question: "¿Qué palabra clave evita que una variable sea serializada?",
    options: ["transient", "volatile", "static", "final"],
    correct: 0,
    level: "advanced"
  },
  {
    question: "¿Cuál es la principal diferencia entre una interfaz y una clase abstracta en Java?",
    options: ["Una interfaz declara comportamiento; una abstracta puede contener implementación y estado", "No hay diferencia", "Una interfaz puede tener estado", "Una clase abstracta no puede tener métodos"],
    correct: 0,
    level: "advanced"
  },
  {
    question: "¿Qué expresión lambda introduce Java 8 para simplificar funciones anónimas?",
    options: ["(a, b) -> a + b", "function(a,b){return a+b}", "lambda(a,b){a+b}", "->(a,b) a+b"],
    correct: 0,
    level: "intermediate"
  }
);

// Función auxiliar para obtener una pregunta aleatoria (ya no filtrada por nivel)
export const getRandomQuestion = () => {
  if (!quizQuestions || quizQuestions.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * quizQuestions.length);
  return quizQuestions[randomIndex];
};