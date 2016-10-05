using System;
using System.Collections.Generic;

namespace PRJ_RungeKutta
{
    /// <summary>
    /// Реализация метода Ру́нге — Ку́тты для обыкновенного дифференциального уравнения
    /// </summary>
    public abstract class RungeKutta
    {
        /// <summary>
        /// Текущее время
        /// </summary>
        public double t;  
        /// <summary>
        /// Искомое решение Y[0] - само решение, Y[i] - i-тая производная решения
        /// </summary>
        public double[] Y; 
        /// <summary>
        /// Внутренние переменные 
        /// </summary>
        double[] YY, Y1, Y2, Y3, Y4;
        protected double[] FY;
        /// <summary>
        /// Конструктор
        /// </summary>
        /// <param name="N">размерность системы</param>
        public RungeKutta(uint N)  
        {
            Init(N);
        }
        /// <summary>
        /// Конструктор
        /// </summary>
        public RungeKutta(){}
        /// <summary>
        /// Выделение памяти под рабочие массивы
        /// </summary>
        /// <param name="N">Размерность массивов</param>
        protected void Init(uint N)
        {             
            Y = new double[N];
            YY = new double[N];
            Y1 = new double[N];
            Y2 = new double[N];
            Y3 = new double[N];
            Y4 = new double[N];
            FY = new double[N];
        }
        /// <summary>
        /// Установка начальных условий
        /// </summary>
        /// <param name="t0">Начальное время</param>
        /// <param name="Y0">Начальное условие</param>
        public void SetInit(double t0, double[] Y0) 
        {                                     
            t = t0;
            if (Y == null) 
                Init((uint)Y0.Length);
            for (int i = 0; i < Y.Length; i++)
                Y[i] = Y0[i];
        }
        /// <summary>
        /// Расчет правых частей системы
        /// </summary>
        /// <param name="t">текущее время</param>
        /// <param name="Y">вектор решения</param>
        /// <returns>правая часть</returns>
        abstract public double[] F(double t, double[] Y); 
        /// <summary>
        /// Следующий шаг метода Рунге-Кутта
        /// </summary>
        /// <param name="dt">текущий шаг по времени (может быть переменным)</param>
        public void NextStep(double dt)
        {
            int i;

            if (dt < 0) return;

            // рассчитать Y1
            Y1 = F(t, Y);

            for (i = 0; i < Y.Length; i++)
                YY[i] = Y[i] + Y1[i] * (dt / 2.0);
            
            // рассчитать Y2
            Y2 = F(t + dt / 2.0, YY);

            for (i = 0; i < Y.Length; i++)
                YY[i] = Y[i] + Y2[i] * (dt / 2.0);
            
            // рассчитать Y3
            Y3 = F(t + dt / 2.0, YY);

            for (i = 0; i < Y.Length; i++)
                YY[i] = Y[i] + Y3[i] * dt;
            
            // рассчитать Y4
            Y4 = F(t + dt, YY);

            // рассчитать решение на новом шаге
            for (i = 0; i < Y.Length; i++)
                Y[i] = Y[i] + dt / 6.0 * (Y1[i] + 2.0 * Y2[i] + 2.0 * Y3[i] + Y4[i]);

            // рассчитать текущее время
            t = t + dt; 
        }
    }
    class TMyRK : RungeKutta
    {
        public TMyRK(uint N) { Init(N);  }

        /// <summary>
        /// пример математический маятник 
        /// y''(t)+y(t)=0
        /// </summary>
        /// <param name="t">Время</param>
        /// <param name="Y">Решение</param>
        /// <returns>Правая часть</returns>
        public override double[] F(double t, double[] Y)
        {
            FY[0] =  Y[1]; 
            FY[1] = -Y[0]; 
            return FY;
        }
        /// <summary>
        /// Пример использования
        /// </summary>
        static public void Test()
        {
            // Шаг по времени
            double dt = 0.001;
            // Объект метода
            TMyRK task = new TMyRK(2);
            // Определим начальные условия y(0)=0, y'(0)=1 задачи
            double[] Y0 = { 0, 1 }; 
            // Установим начальные условия задачи
            task.SetInit(0, Y0);
            // решаем до 15 секунд
            while (task.t <= 15) 
            {
                Console.WriteLine("Time = {0:F5}; Func = {1:F8};  d Func / d x = {2:F8}", task.t, task.Y[0], task.Y[1]); // вывести t, y, y'
                // рассчитать на следующем шаге, шаг интегрирования 
                task.NextStep(dt);
            }
            Console.ReadLine();
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            TMyRK.Test();
        }
    }
}