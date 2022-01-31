import Head from 'next/head';

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Thunder</title>
        <link rel='icon' href='../imgs/thunder.png' />
      </Head>
      <main className='p-10 bg-slate-100 h-screen w-screen flex justify-center items-center'>
        {children}
      </main>
    </>
  );
};

export default Layout;
