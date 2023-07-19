{
  # Override nixpkgs to use the latest set of node packages
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/master";

  outputs =
    { self
    , nixpkgs
    , flake-utils
    ,
    }:
    flake-utils.lib.eachDefaultSystem
      (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            # You can set the major version of Node.js to a specific one instead
            # of the default version
            # nodejs-19_x

            # You can choose pnpm, yarn, or none (npm).
            nodePackages.pnpm
            # yarn
          ];
        };
      });
}
