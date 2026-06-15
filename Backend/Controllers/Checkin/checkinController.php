<?php

use Respect\Validation\Exceptions\NestedValidationException;
use Respect\Validation\Validator as v;

require_once __DIR__ . "/../../Services/Checkin/checkinService.php";
require_once __DIR__ . "/../../Middleware/middleware.php";

class CheckinController
{
    protected $checkinService;

    public function __construct()
    {
        $this->checkinService = new CheckinService();
    }

    public function validarDados($dados)
    {
        try {

            $esquema = v::key('convidado_idconvidado', v::intval()->notEmpty());



            $esquema->assert($dados);
        } catch (NestedValidationException $e) {
            $mensagemPersonalizada = [
                'convidado_idconvidado' => 'Referência de convidado inválida'

            ];

            $mensagemOriginal = $e->getMessages();
            $mensagemTraduzida = [];

            foreach ($mensagemOriginal as $campo => $mensagem) {
                $mensagemTraduzida[$campo] = $mensagemPersonalizada[$campo] ?? $mensagem;
            }

            http_response_code(400);
            echo json_encode([
                'sucesso' => false,
                'mensagem' => 'Erro de validação',
                'erros' => $mensagemTraduzida
            ]);
            exit;
        }
    }



    public function listarCheckins()
    {
        Middleware::validarMiddleware();
        http_response_code(200);
        echo json_encode($this->checkinService->listarCheckins());
        exit;
    }

    public function criarCheckin()
    {
        try {
            $jwt = Middleware::validarMiddleware();


            $dados = json_decode(file_get_contents('php://input'), true);
            $this->validarDados($dados);

            http_response_code(201);
            echo json_encode($this->checkinService->criarCheckin($dados, $jwt));
            exit;
        } catch (Exception $e) {
            http_response_code($e->getCode());
            echo json_encode([
                'sucesso' => false,
                'mensagem' => $e->getMessage()
            ]);
            exit;
        }
    }



    public function cancelarCheckin()
    {
        try {
            $jwt = Middleware::validarMiddleware();



            $id = $_GET['id_checkin'];


            http_response_code(200);
            echo json_encode($this->checkinService->cancelarCheckin($id));
            exit;
        } catch (Exception $e) {
            http_response_code($e->getCode());
            echo json_encode([
                'sucesso' => false,
                'mensagem' => $e->getMessage()
            ]);
            exit;
        }
    }
}
