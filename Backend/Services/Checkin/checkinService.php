<?php
date_default_timezone_set('America/Sao_Paulo');

use Firebase\JWT\JWT;

require_once __DIR__ . "/../../Connection/db.php";

class CheckinService
{
    protected $db;

    public function __construct()
    {
        $this->db = db();
    }

    public function buscarCheckinPorId($idCheckin)
    {
        if (empty($idCheckin)) {
            throw new Exception('Dados inválidos', 400);
        }

        $buscar = $this->db->prepare('SELECT * FROM checkin WHERE id_checkin = :id_checkin');

        $buscar->execute([
            ':id_checkin' => $idCheckin
        ]);

        $checkin = $buscar->fetch();

        if (empty($checkin)) {
            return [
                'sucesso' => false,
                'mensagem' => 'Checkin não encontrado',
                'codigo' => 404
            ];
        }

        return [
            'sucesso' => true,
            'dados' => $checkin
        ];
    }



    public function listarCheckins()
    {
        $listagem = $this->db->prepare("SELECT c.id_checkin, c.data_e_hora, c.status, u.nome as nome_usuario, u.cpf as cpf_usuario,
        co.nome as nome_convidado, co.sobrenome as sobrenome_convidado, co.cpf as cpf_convidado, co.id_convidado, co.confirmacao
        FROM convidado co LEFT JOIN checkin c ON c.convidado_idconvidado = co.id_convidado
        LEFT JOIN usuario u ON u.id_usuario = c.usuario_idusuario WHERE co.confirmacao IN ('pendente', 'confirmado') ");

        $listagem->execute();
        $resultado = [];

        while ($row = $listagem->fetch()) {
            

                $data = new Datetime($row['data_e_hora']);
                $dataFormatada = $data->format('d-m-Y H:i:s');
            

            $resultado[] = [
                'id_convidado' => $row['id_convidado'],
                'id_checkin' => $row['id_checkin'],
                'data_e_hora' => $dataFormatada ?? $row['data_e_hora'],
                'status' => $row['status'],
                'usuario' => [
                    'nome' => $row['nome_usuario'],
                    'cpf' => $row['cpf_usuario']
                ],
                'convidado' => [
                    'nome' => $row['nome_convidado'],
                    'sobrenome' => $row['sobrenome_convidado'],
                    'cpf' => $row['cpf_convidado'],
                    'confirmacao' => $row['confirmacao']
                ]
            ];
        }

        return [
            'sucesso' => true,
            'dados' => $resultado
        ];
    }

    public function  criarCheckin($checkinDados, $jwt)
    {
        try {




            $data = date('Y-m-d H:i:s');


            $criar = $this->db->prepare('INSERT INTO checkin (usuario_idusuario, convidado_idconvidado, data_e_hora, status)
            VALUES (:usuario_idusuario, :convidado_idconvidado, :data_e_hora, :status)');

            $criar->execute([
                ':usuario_idusuario' => $jwt->dados->id_usuario,
                ':convidado_idconvidado' => $checkinDados['convidado_idconvidado'],
                ':data_e_hora' => $data,
                ':status' => 'realizado'
            ]);

            $atualizarConvidado = $this->db->prepare('UPDATE convidado SET confirmacao = :confirmacao WHERE id_convidado = :id_convidado');

            $atualizarConvidado->execute([
                ':confirmacao' => 'confirmado',
                ':id_convidado' => $checkinDados['convidado_idconvidado']
            ]);

            return [
                'sucesso' => true,
                'mensagem' => 'Checkin criado com sucesso'
            ];
        } catch (PDOException $e) {
            if (str_contains($e->getMessage(), 'convidado_idconvidado')) {
                throw new Exception('Checkin já realizado', 409);
            }

            if (str_contains($e->getMessage(), 'fk_checkin_usuario')) {
                throw new Exception('Usuário referenciado não encontrado', 404);
            }
            if (str_contains($e->getMessage(), 'fk_checkin_convidado')) {
                throw new Exception('Convidado referenciado não encontrado', 404);
            }
            throw new Exception('Erro ao tentar realizar checkin', 500);
        }
    }



    public function cancelarCheckin($idCheckin)
    {
        try {


            $checkin = $this->buscarCheckinPorId($idCheckin);

            if ($checkin['sucesso'] === false) {
                throw new Exception($checkin['mensagem'], $checkin['codigo']);
            }


            $atualizar = $this->db->prepare('DELETE FROM checkin WHERE id_checkin = :id_checkin');

            $atualizar->execute([
                ':id_checkin' => $idCheckin
            ]);

            return [
                'sucesso' => true,
                'mensagem' => 'Checkin cancelado com sucesso'
            ];
        } catch (PDOException $e) {



            throw new Exception('Erro ao cancelar checkin', 500);
        }
    }
}
