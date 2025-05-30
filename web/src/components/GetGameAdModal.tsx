import { useEffect, useState } from "react";
import axios from "axios";
import * as Dialog from "@radix-ui/react-dialog";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useKeenSlider } from "keen-slider/react";
import { CaretLeft, CaretRight, SpinnerGap } from "phosphor-react";

import { Game } from "../App";

interface GetGameAdModal {
  game: Game;
}

interface GameAds {
  id: string;
  name: string;
  yearsPlaying: number;
  discord: string;
  weekDays: string[];
  hourEnd: string;
  hourStart: string;
  useVoiceChannel: boolean;
}

export default function GetGameAdModal({ game }: GetGameAdModal) {
  const [gameAds, setGameAds] = useState<GameAds[]>([]);
  const [isGameAdsLoaded, setIsGameAdsLoaded] = useState(false);
  const [copyToClipboard, setCopyToClipboard] = useState<String | undefined>(
    undefined
  );

  useEffect(() => {
    if (!game) return;

    axios(`http://localhost:3333/games/${game.id}/ads`).then((response) => {
      /**
       * Timeout used only for presentation purpose
       */
      setTimeout(() => {
        setGameAds(response.data);
        setIsGameAdsLoaded(true);
      }, 500);
    });
  }, [game]);

  const [gameAdsSliderRef, gameAdsSliderInstanceRef] =
    useKeenSlider<HTMLDivElement>({
      loop: true,
      slides: {
        origin: "center",
        number: gameAds.length,
        perView: 1,
        spacing: 15,
      },
    });

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed animate-[show_0.2s_ease-in]" />
      <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-4 bg-[#2A2634] text-white rounded-lg w-[95vw] max-w-[480px] animate-[show_0.2s_ease-in]">
        <div className="w-[100%] h-28 sm:h-40 overflow-hidden my-4 rounded-lg px-4 sm:px-10">
          <img
            className="w-[100%] h-auto"
            src={game.bannerUrl}
            alt={game.title}
          />
        </div>

        <div className=" px-6 sm:px-8">
          <Dialog.Title className="text-lg sm:text-3xl font-black">
            {game.title}
          </Dialog.Title>
          <h3>Conecte-se e comece a jogar!</h3>
        </div>

        <div className="w-[100%] relative mt-2 flex justify-center items-center">
          <div className=" w-[60%]">
            {gameAds && isGameAdsLoaded ? (
              <div className="keen-slider z-0 relative" ref={gameAdsSliderRef}>
                {gameAds.map((ads: GameAds) => (
                  <div key={ads.id} className="keen-slider__slide px-4">
                    <strong className="w-[100%] text-lg text-center font-bold text-white block mx-auto">
                      {ads.name}
                    </strong>
                    <div className=" flex flex-col gap-2 rounded text-white">
                      <p className="text-xs text-center border-t m-1 border-violet-600 pt-2">
                        Jogando há
                        {ads.yearsPlaying === 1
                          ? ` ${ads.yearsPlaying} ano`
                          : ` ${ads.yearsPlaying} anos`}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {ads.weekDays.sort().map((day) => {
                          switch (day) {
                            case "0":
                              return (
                                <span className=" bg-violet-500 rounded p-1 text-sm">
                                  domingo
                                </span>
                              );
                              break;
                            case "1":
                              return (
                                <span className=" bg-violet-500 rounded p-1 text-sm mx-1">
                                  segunda
                                </span>
                              );
                              break;
                            case "2":
                              return (
                                <span className=" bg-violet-500 rounded p-1 text-sm">
                                  terça
                                </span>
                              );
                              break;
                            case "3":
                              return (
                                <span className=" bg-violet-500 rounded p-1 text-sm">
                                  quarta
                                </span>
                              );
                              break;
                            case "4":
                              return (
                                <span className=" bg-violet-500 rounded p-1 text-sm">
                                  quinta
                                </span>
                              );
                              break;
                            case "5":
                              return (
                                <span className=" bg-violet-500 rounded p-1 text-sm">
                                  sexta
                                </span>
                              );
                              break;
                            case "6":
                              return (
                                <span className=" bg-violet-500 rounded p-1 text-sm">
                                  sábado
                                </span>
                              );
                              break;

                            default:
                              break;
                          }
                        })}
                      </div>

                      <p className="bg-violet-700 rounded text-xs p-1 text-center">
                        {`${ads.hourStart} as ${ads.hourEnd}`}
                      </p>

                      <p className="text-center">
                        <span className="text-sm text-zinc-300 pr-2">
                          Usa chat de voz:
                        </span>
                        {ads.useVoiceChannel ? (
                          <span className="text-green-500 text-xs">SIM</span>
                        ) : (
                          <span className="text-red-500 text-xs">NAO</span>
                        )}
                      </p>

                      <p className="text-center border-t mt-2 border-violet-600 pt-2">
                        {ads.discord}
                        <div className="w-[100%] text-center relative">
                          <CopyToClipboard
                            text={ads.discord}
                            onCopy={() => setCopyToClipboard(ads.discord)}
                          >
                            <button className=" rounded bg-violet-700 hover:bg-violet-500 p-2 my-1 mx-auto font-bold">
                              {copyToClipboard === ads.discord ? (
                                <span className="text-green-500">
                                  Discord copiado!
                                </span>
                              ) : (
                                "Copiar discord?"
                              )}
                            </button>
                          </CopyToClipboard>
                        </div>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <SpinnerGap className="w-10 h-10 mx-auto my-8 animate-spin text-violet-500" />
            )}
          </div>

          {isGameAdsLoaded &&
            gameAds.length > 2 &&
            gameAdsSliderInstanceRef.current && (
              <>
                <button
                  className="delay 100 w-auto h-[100%] left-0 absolute z-10 cursor-pointer rounded-tl text-left text-violet-900 hover:text-violet-500"
                  onClick={(e: any) =>
                    e.stopPropagation() ||
                    gameAdsSliderInstanceRef.current?.prev()
                  }
                >
                  <CaretLeft className=" w-20 h-20" />
                </button>

                <button
                  className="delay-100 w-auto h-[100%] right-0 absolute z-10 cursor-pointer rounded-tr text-violet-900 hover:text-violet-500"
                  onClick={(e: any) =>
                    e.stopPropagation() ||
                    gameAdsSliderInstanceRef.current?.prev()
                  }
                >
                  <CaretRight
                    className=" w-20 h-20"
                    onClick={(e: any) =>
                      e.stopPropagation() ||
                      gameAdsSliderInstanceRef.current?.next()
                    }
                  />
                </button>
              </>
            )}
        </div>

        <div className="m-4 px-5">
          Existe{" "}
          <span
            className={`font-bold mx-1 ${
              gameAds.length === 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            {gameAds.length}{" "}
          </span>
          jogador
          {`${gameAds.length > 1 ? "es" : ""} a procura.`}
        </div>

        <footer className="mt-8 px-10 flex gap-4 justify-end">
          <Dialog.Close
            type="button"
            className="bg-zinc-500 px-6 h-12 rounded-md font-semibold hover:bg-zinc-600"
          >
            Fechar
          </Dialog.Close>
        </footer>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
