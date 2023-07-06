import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  src: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Multi-Platform',
    src: `/img/Multiplatform.svg`,
    description: (
      <>
        React web app, iOS and Android native apps are available. You can
        choose one or all of them.
      </>
    ),
  },
  {
    title: 'Easy to Use',
    src: `/img/EasyToUse.svg`,
    description: (
      <>
        Spika3 was designed from the ground up to be easily deployed and
        used to get your chat app up and running quickly.
      </>
    ),
  },
  {
    title: 'Open Source',
    src: `/img/OpenSource.svg`,
    description: (
      <>
        Spika3 is open source and free to use. You can use it for your
        commercial projects.
      </>
    ),
  },
 
];

function Feature({title, src, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img className={styles.featureSvg} src={src} alt='Spika 3 Feature' />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
