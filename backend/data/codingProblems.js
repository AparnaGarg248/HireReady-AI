// Each problem gives students an input on stdin and expects an exact
// stdout match. This keeps evaluation simple and language-agnostic so it
// works the same way for JavaScript, Python, Java, C++ or C via Judge0.

const codingProblems = [
  {
    id: 1,
    title: "Sum of Two Numbers",
    difficulty: "Easy",
    description:
      "Read two space-separated integers A and B from standard input and print their sum.",
    starterCode: {
      javascript:
        "const line = require('fs').readFileSync('/dev/stdin', 'utf8').trim();\nconst [a, b] = line.split(' ').map(Number);\nconsole.log(a + b);",
      python: "a, b = map(int, input().split())\nprint(a + b)",
      java:
        "import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a = sc.nextInt();\n    int b = sc.nextInt();\n    System.out.println(a + b);\n  }\n}",
      cpp:
        "#include <iostream>\nusing namespace std;\nint main() {\n  int a, b;\n  cin >> a >> b;\n  cout << a + b << endl;\n  return 0;\n}"
    },
    testCases: [
      { input: "2 3", expectedOutput: "5" },
      { input: "10 15", expectedOutput: "25" },
      { input: "-4 4", expectedOutput: "0" }
    ]
  },
  {
    id: 2,
    title: "Reverse a String",
    difficulty: "Easy",
    description: "Read a single line string and print it reversed.",
    starterCode: {
      javascript:
        "const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();\nconsole.log(s.split('').reverse().join(''));",
      python: "s = input()\nprint(s[::-1])",
      java:
        "import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.nextLine();\n    System.out.println(new StringBuilder(s).reverse().toString());\n  }\n}",
      cpp:
        "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n  string s;\n  getline(cin, s);\n  reverse(s.begin(), s.end());\n  cout << s << endl;\n  return 0;\n}"
    },
    testCases: [
      { input: "hireready", expectedOutput: "ydaerierih" },
      { input: "chitkara", expectedOutput: "arakcihc" }
    ]
  },
  {
    id: 3,
    title: "Check Prime Number",
    difficulty: "Medium",
    description: "Read an integer N and print 'YES' if it is prime, otherwise print 'NO'.",
    starterCode: {
      javascript:
        "const n = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());\nfunction isPrime(x){ if(x<2) return false; for(let i=2;i*i<=x;i++){ if(x%i===0) return false;} return true;}\nconsole.log(isPrime(n) ? 'YES' : 'NO');",
      python:
        "n = int(input())\ndef is_prime(x):\n    if x < 2:\n        return False\n    for i in range(2, int(x ** 0.5) + 1):\n        if x % i == 0:\n            return False\n    return True\nprint('YES' if is_prime(n) else 'NO')",
      java:
        "import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    boolean prime = n >= 2;\n    for (int i = 2; i * i <= n; i++) if (n % i == 0) { prime = false; break; }\n    System.out.println(prime ? \"YES\" : \"NO\");\n  }\n}",
      cpp:
        "#include <iostream>\nusing namespace std;\nint main() {\n  int n; cin >> n;\n  bool prime = n >= 2;\n  for (int i = 2; i * i <= n; i++) if (n % i == 0) { prime = false; break; }\n  cout << (prime ? \"YES\" : \"NO\") << endl;\n  return 0;\n}"
    },
    testCases: [
      { input: "7", expectedOutput: "YES" },
      { input: "10", expectedOutput: "NO" },
      { input: "2", expectedOutput: "YES" }
    ]
  },
  {
    id: 4,
    title: "Find the Maximum in an Array",
    difficulty: "Medium",
    description:
      "Read N, then N space-separated integers on the next line, and print the maximum value.",
    starterCode: {
      javascript:
        "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');\nconst arr = lines[1].split(' ').map(Number);\nconsole.log(Math.max(...arr));",
      python: "n = int(input())\narr = list(map(int, input().split()))\nprint(max(arr))",
      java:
        "import java.util.*;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int max = Integer.MIN_VALUE;\n    for (int i = 0; i < n; i++) { int v = sc.nextInt(); if (v > max) max = v; }\n    System.out.println(max);\n  }\n}",
      cpp:
        "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n  int n; cin >> n;\n  int mx = INT_MIN;\n  for (int i = 0; i < n; i++) { int v; cin >> v; mx = max(mx, v); }\n  cout << mx << endl;\n  return 0;\n}"
    },
    testCases: [
      { input: "5\n3 7 2 9 4", expectedOutput: "9" },
      { input: "3\n-1 -5 -2", expectedOutput: "-1" }
    ]
  },
  {
    id: 5,
    title: "Palindrome Check",
    difficulty: "Easy",
    description: "Read a word and print 'YES' if it is a palindrome, otherwise print 'NO'.",
    starterCode: {
      javascript:
        "const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();\nconsole.log(s === s.split('').reverse().join('') ? 'YES' : 'NO');",
      python: "s = input()\nprint('YES' if s == s[::-1] else 'NO')",
      java:
        "import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.nextLine();\n    String r = new StringBuilder(s).reverse().toString();\n    System.out.println(s.equals(r) ? \"YES\" : \"NO\");\n  }\n}",
      cpp:
        "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n  string s; getline(cin, s);\n  string r = s; reverse(r.begin(), r.end());\n  cout << (s == r ? \"YES\" : \"NO\") << endl;\n  return 0;\n}"
    },
    testCases: [
      { input: "madam", expectedOutput: "YES" },
      { input: "hello", expectedOutput: "NO" }
    ]
  }
];

module.exports = codingProblems;
